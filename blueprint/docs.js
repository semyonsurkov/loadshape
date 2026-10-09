import { fetchText, handleLinks, markdown, renderMermaid, scrollToAnchor, sourceLabel } from "./markdown.js";

const STATUS_LINE = /^\s*(?:[-*]\s+)?(?:\*\*)?(?:Статус|Status)(?:\*\*)?\s*[:：]\s*(?:\*\*)?\s*(.+?)\s*$/im;
const STATUS_FRONT_MATTER = /^status:\s*(.+)$/im;

export const normalizeDir = (dir) => (dir === "." ? "" : dir.replace(/^\.\//, "").replace(/\/+$/, ""));

const inside = (dir) => {
  const base = normalizeDir(dir);
  return base ? `${base}/` : "";
};

const fetchTree = async (dir) => {
  const response = await fetch(`/api/tree?dir=${encodeURIComponent(dir)}`);
  if (!response.ok) throw new Error(`Сервер не отдал список файлов папки ${dir}`);
  return response.json();
};

const buildTree = (files, dir) => {
  const prefix = inside(dir);
  const root = { folders: new Map(), files: [] };
  for (const path of files) {
    const parts = path.slice(prefix.length).split("/");
    let node = root;
    for (const folder of parts.slice(0, -1)) {
      if (!node.folders.has(folder)) node.folders.set(folder, { folders: new Map(), files: [] });
      node = node.folders.get(folder);
    }
    node.files.push({ name: parts.at(-1), path });
  }
  return root;
};

const openFolders = (tabId) => {
  try {
    return new Set(JSON.parse(localStorage.getItem(`blueprint_tree_${tabId}`) ?? "[]"));
  } catch {
    return new Set();
  }
};

const rememberFolders = (tabId, nav) => {
  const open = [...nav.querySelectorAll("details[open]")].map((folder) => folder.dataset.folder);
  try { localStorage.setItem(`blueprint_tree_${tabId}`, JSON.stringify(open)); } catch {}
};

const fileLink = (path, ...children) => {
  const link = document.createElement("a");
  link.href = "#";
  link.dataset.path = path;
  link.append(...children);
  return link;
};

const treeNodes = (node, open, prefix = "") => {
  const list = document.createElement("ul");
  for (const [name, child] of node.folders) {
    const folder = document.createElement("details");
    const path = `${prefix}${name}/`;
    folder.dataset.folder = path;
    folder.open = open.has(path);
    const summary = document.createElement("summary");
    summary.textContent = name;
    folder.append(summary, treeNodes(child, open, path));
    const item = document.createElement("li");
    item.append(folder);
    list.append(item);
  }
  for (const file of node.files) {
    const item = document.createElement("li");
    item.append(fileLink(file.path, file.name.replace(/\.md$/, "")));
    list.append(item);
  }
  return list;
};

const adrEntry = async (path) => {
  const text = (await fetchText(path)) ?? "";
  const title = text.match(/^#\s+(.+)$/m)?.[1] ?? path.split("/").at(-1);
  const status = text.match(STATUS_LINE)?.[1] ?? text.match(STATUS_FRONT_MATTER)?.[1] ?? "";
  return { path, title, status: status.split(/[;.]/)[0] };
};

const adrNodes = (entries) => {
  const list = document.createElement("ul");
  for (const entry of entries) {
    const title = Object.assign(document.createElement("span"), { className: "adr_title", textContent: entry.title });
    const status = Object.assign(document.createElement("span"), { className: "adr_status", textContent: entry.status });
    const item = document.createElement("li");
    item.append(fileLink(entry.path, title, status));
    list.append(item);
  }
  return list;
};

const renderLibrary = (buildNav) => async (tab, ready, ctx, initialPath) => {
  const layout = document.createElement("div");
  layout.className = "library";
  const nav = document.createElement("nav");
  nav.className = "tree";
  const article = document.createElement("article");
  article.className = "doc";
  layout.append(nav, article);
  ctx.view.append(layout);
  const files = await fetchTree(tab.dir);
  const { node, fallback } = await buildNav(tab, files);
  nav.append(node);
  let shown = 0;
  let currentPath = "";
  handleLinks(article, () => currentPath, ctx.openDocument);
  const show = async (path, anchor) => {
    const mine = ++shown;
    for (const link of nav.querySelectorAll("a[data-path]")) {
      if (link.dataset.path === path) {
        link.setAttribute("aria-current", "page");
        for (let folder = link.closest("details"); folder; folder = folder.parentElement.closest("details")) folder.open = true;
      } else link.removeAttribute("aria-current");
    }
    rememberFolders(tab.id, nav);
    const body = await markdown(await fetchText(path), path);
    if (mine !== shown) return;
    currentPath = path;
    article.replaceChildren(sourceLabel("div", path), body);
    await renderMermaid(article, ctx.theme());
    if (anchor) scrollToAnchor(article, anchor);
    else article.scrollTop = 0;
  };
  nav.addEventListener("toggle", () => rememberFolders(tab.id, nav), true);
  nav.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-path]");
    if (!link) return;
    event.preventDefault();
    history.replaceState(null, "", ctx.tabHash(tab.id, link.dataset.path));
    show(link.dataset.path);
  });
  if (initialPath && !files.includes(initialPath)) {
    article.replaceChildren(sourceLabel("div", initialPath), Object.assign(document.createElement("p"), {
      textContent: "Этого файла нет в списке вкладки: он исключён из документации или удалён",
    }));
  } else if (initialPath || fallback) {
    await show(initialPath || fallback, ctx.takeAnchor());
  } else {
    article.textContent = "В папке нет markdown-файлов";
  }
  ready();
  ctx.setActiveTab({ id: tab.id, show, has: (path) => files.includes(path) });
  return () => ctx.setActiveTab(null);
};

export const renderDocsTab = renderLibrary(async (tab, files) => {
  const readme = files.find((path) => path === `${inside(tab.dir)}README.md`);
  return { node: treeNodes(buildTree(files, tab.dir), openFolders(tab.id)), fallback: readme ?? files[0] };
});

export const renderAdrTab = renderLibrary(async (tab, files) => {
  const decisions = files.filter((path) => !path.endsWith("/README.md") && path !== "README.md");
  const entries = await Promise.all(decisions.map(adrEntry));
  return { node: adrNodes(entries), fallback: decisions[0] };
});

export const coversPath = (tab, path) => (tab.type === "docs" || tab.type === "adr") && path.startsWith(inside(tab.dir));
