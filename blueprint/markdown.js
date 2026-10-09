const HEADING_ID_PREFIX = "user-content-";
const FORBIDDEN_TAGS = ["style", "form", "button", "textarea", "select", "option"];
const FORBIDDEN_ATTRIBUTES = ["style"];
const MISSING_FILE = "Файл не найден";
const EXTERNAL = /^([a-z]+:|\/)/i;

let parser = null;
let mermaidCounter = 0;

export const fileUrl = (path) => `/${path.split("/").map(encodeURIComponent).join("/")}`;

export const fetchText = async (path) => {
  const response = await fetch(fileUrl(path));
  return response.ok ? response.text() : null;
};

export const decodeHref = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const resolvePath = (from, href) => {
  const parts = from.split("/").slice(0, -1);
  for (const part of href.split("/")) {
    if (part === "..") parts.pop();
    else if (part && part !== ".") parts.push(part);
  }
  return parts.join("/");
};

const loadParser = () => {
  parser ??= Promise.all([import("marked"), import("marked-gfm-heading-id"), import("dompurify")])
    .then(([{ marked }, { gfmHeadingId }, { default: DOMPurify }]) => {
      marked.use(gfmHeadingId({ prefix: HEADING_ID_PREFIX }));
      DOMPurify.addHook("uponSanitizeElement", (node, data) => {
        if (data.tagName === "input" && node.getAttribute("type") !== "checkbox") node.remove();
      });
      return (text) => DOMPurify.sanitize(marked.parse(text), { FORBID_TAGS: FORBIDDEN_TAGS, FORBID_ATTR: FORBIDDEN_ATTRIBUTES });
    })
    .catch((error) => {
      parser = null;
      throw new Error(`Не загрузились библиотеки разметки с esm.sh: ${error.message}`);
    });
  return parser;
};

export const markdown = async (text, path) => {
  const body = document.createElement("div");
  body.className = "doc_body";
  if (text === null) {
    body.textContent = MISSING_FILE;
    return body;
  }
  const toHtml = await loadParser();
  body.innerHTML = toHtml(text);
  for (const image of body.querySelectorAll("img[src]")) {
    const src = image.getAttribute("src");
    if (!EXTERNAL.test(src) && !src.startsWith("#")) image.src = fileUrl(resolvePath(path, decodeHref(src)));
  }
  return body;
};

export const sourceLabel = (tag, path) => {
  const label = document.createElement(tag);
  label.className = "source";
  label.textContent = path;
  return label;
};

export const scrollToAnchor = (container, anchor) => {
  const target = container.querySelector(`[id="${CSS.escape(HEADING_ID_PREFIX + anchor)}"]`)
    ?? container.querySelector(`[id="${CSS.escape(anchor)}"]`);
  target?.scrollIntoView({ block: "start" });
};

export const handleLinks = (container, currentPath, openDocument) => {
  container.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || !container.contains(link)) return;
    const href = link.getAttribute("href");
    if (href.startsWith("#")) {
      event.preventDefault();
      scrollToAnchor(container, decodeHref(href.slice(1)));
      return;
    }
    if (EXTERNAL.test(href)) return;
    const [file, anchor] = href.split("#");
    if (!file.endsWith(".md")) return;
    event.preventDefault();
    openDocument(resolvePath(currentPath(), decodeHref(file)), anchor && decodeHref(anchor));
  });
};

export const renderMermaid = async (container, theme) => {
  const blocks = container.querySelectorAll("pre > code.language-mermaid");
  if (blocks.length === 0) return;
  const { default: mermaid } = await import("mermaid");
  mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: theme === "dark" ? "dark" : "default" });
  for (const code of blocks) {
    const id = `mermaid_${++mermaidCounter}`;
    const figure = document.createElement("div");
    figure.className = "diagram";
    try {
      const { svg } = await mermaid.render(id, code.textContent);
      figure.innerHTML = svg;
      code.parentElement.replaceWith(figure);
    } catch {
      document.getElementById(`d${id}`)?.remove();
      code.parentElement.classList.add("diagram_error");
    }
  }
};

export const renderDocs = async (docs, container, ctx) => {
  for (const item of docs) {
    const { path, collapsed } = typeof item === "string" ? { path: item } : item;
    const foldable = collapsed !== undefined;
    const section = document.createElement(foldable ? "details" : "section");
    section.className = "doc";
    section.open = collapsed === false;
    section.append(sourceLabel(foldable ? "summary" : "div", path), await markdown(await fetchText(path), path));
    handleLinks(section, () => path, ctx.openDocument);
    container.append(section);
    await renderMermaid(section, ctx.theme());
  }
};
