import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { createServer } from 'vite';

const execute = promisify(execFile);
const playground = fileURLToPath(new URL('../', import.meta.url));
const repository = fileURLToPath(new URL('../../../', import.meta.url));
const runId = `${new Date().toISOString().replaceAll(':', '-')}-${process.pid}`;
const evidence = `${repository}.scratch/verification/card/${runId}`;
const session = `loadshape-card-${process.pid}-${Date.now()}`;
const VIEWPORT = { width: 1440, height: 1000 };
const PREVIEW_WIDTH = '375';
const GEOMETRY_TOLERANCE_PX = 0.5;
const COMMAND_TIMEOUT_MS = 60_000;
const LOADING_SELECTOR = '[data-skeleton="loading"]';
const report = {
  scenario: 'Card: content -> loading -> content',
  startedAt: new Date().toISOString(),
  session,
  status: 'running',
  checks: [],
  steps: [],
  unverified: [
    'React 18, WebKit, other stands, real data fetching, exact delay timing, pixel parity',
  ],
};

let server;
let browserAttempted = false;

async function browser(...args) {
  let stdout;
  try {
    ({ stdout } = await execute('agent-browser', ['--session', session, '--json', ...args], {
      cwd: repository,
      timeout: COMMAND_TIMEOUT_MS,
    }));
  } catch (error) {
    throw new Error([error.message, error.stdout, error.stderr].filter(Boolean).join('\n'), {
      cause: error,
    });
  }
  const response = JSON.parse(stdout);
  assert.equal(response.success, true, response.error ?? `Failed: ${args.join(' ')}`);
  report.steps.push({ command: args, result: response.data });
  return response.data;
}

async function inspect(script) {
  return (await browser('eval', script)).result;
}

async function click(name) {
  await browser('find', 'role', 'button', 'click', '--name', name, '--exact');
}

async function capture(name) {
  const state = await inspect(`(async () => {
    await document.fonts.ready;
    const card = document.querySelector('section');
    if (!card || document.querySelectorAll('section').length !== 1) {
      throw new Error('Expected one profile card');
    }
    await Promise.all([...card.querySelectorAll('img')].map(image => image.decode()));
    const root = card.parentElement;
    const button = card.querySelector('button');
    const nodes = [root, card, ...card.querySelectorAll('img, h2, p, dl, button')];
    return {
      loading: root.getAttribute('data-skeleton'),
      inert: root.inert,
      busy: root.parentElement.getAttribute('aria-busy'),
      textColor: getComputedStyle(card.querySelector('h2')).webkitTextFillColor,
      textDecorationColor: getComputedStyle(card.querySelector('h2')).textDecorationColor,
      viewport: { width: innerWidth, height: innerHeight },
      previewWidth: root.parentElement.getBoundingClientRect().width,
      name: card.querySelector('h2').textContent,
      bio: card.querySelector('p').textContent,
      focused: document.activeElement === button,
      geometry: nodes.map(node => {
        const rect = node.getBoundingClientRect();
        return { tag: node.tagName, x: rect.x + scrollX, y: rect.y + scrollY,
          width: rect.width, height: rect.height };
      }),
    };
  })()`);
  await browser('screenshot', '--full', `${evidence}/${name}.png`);
  report[name] = state;
  return state;
}

function compareGeometry(before, after) {
  assert.equal(after.length, before.length, 'The card structure changed');
  for (const [index, box] of before.entries()) {
    assert.equal(after[index].tag, box.tag);
    for (const key of ['x', 'y', 'width', 'height']) {
      assert.ok(
        Math.abs(after[index][key] - box[key]) <= GEOMETRY_TOLERANCE_PX,
        `${box.tag}[${index}].${key} changed: ${box[key]} -> ${after[index][key]}`,
      );
    }
  }
}

await mkdir(evidence, { recursive: true });

try {
  report.agentBrowser = (await execute('agent-browser', ['--version'])).stdout.trim();
  server = await createServer({
    root: playground,
    configFile: `${playground}vite.config.ts`,
    base: '/',
    server: { host: '127.0.0.1', port: 0, strictPort: true, open: false },
  });
  await server.listen();
  const address = server.httpServer.address();
  assert.ok(address && typeof address === 'object');
  report.url = `http://127.0.0.1:${address.port}/stands/card`;
  browserAttempted = true;
  await browser('open', report.url);
  await browser('set', 'viewport', String(VIEWPORT.width), String(VIEWPORT.height));
  await browser('wait', '--fn', 'document.querySelector("h1")?.textContent === "Card"');
  const { refs } = await browser('snapshot', '-i');
  for (const [label, value] of [
    ['Theme', 'light'],
    ['Preview width', PREVIEW_WIDTH],
    ['Text length', 'long'],
  ]) {
    const entry = Object.entries(refs).find(
      ([, element]) => element.role === 'combobox' && element.name === label,
    );
    assert.ok(entry, `Missing control: ${label}`);
    await browser('select', `@${entry[0]}`, value);
  }
  await click('Show content');
  await browser('wait', '--fn', `!document.querySelector('${LOADING_SELECTOR}')`);
  const focusButton = `(() => {
    const button = document.querySelector('section button');
    button.focus();
    return document.activeElement === button;
  })()`;
  assert.equal(await inspect(focusButton), true, 'Loaded Follow button cannot receive focus');
  const content = await capture('content');
  assert.deepEqual(content.viewport, VIEWPORT);
  assert.equal(content.previewWidth, Number(PREVIEW_WIDTH));
  assert.equal(content.name, 'Semyon Surkov');
  assert.ok(content.bio.length > 100, 'Long text mode was not applied');
  assert.equal(content.inert, false);
  assert.equal(content.busy, null);
  assert.notEqual(content.textColor, 'rgba(0, 0, 0, 0)');
  report.checks.push('Loaded card is readable, long text and 375 px preview are active');

  await click('Show loading');
  await browser('wait', '--fn', `Boolean(document.querySelector('${LOADING_SELECTOR}'))`);
  await browser(
    'wait',
    '--fn',
    `(() => {
      const context = document.createElement('canvas').getContext('2d');
      context.fillStyle = getComputedStyle(document.querySelector('h2')).textDecorationColor;
      context.fillRect(0, 0, 1, 1);
      return context.getImageData(0, 0, 1, 1).data[3] > 0;
    })()`,
  );
  assert.equal(await inspect(focusButton), false, 'Loading Follow button received focus');
  const loading = await capture('loading');
  assert.equal(loading.inert, true);
  assert.equal(loading.busy, 'true');
  assert.equal(loading.textColor, 'rgba(0, 0, 0, 0)');
  compareGeometry(content.geometry, loading.geometry);
  report.checks.push('Loading skeleton paints, hides text, blocks focus and keeps geometry');

  await click('Show content');
  await browser('wait', '--fn', `!document.querySelector('${LOADING_SELECTOR}')`);
  assert.equal(await inspect(focusButton), true, 'Follow focus did not recover');
  const recovered = await capture('recovered');
  assert.equal(recovered.inert, false);
  assert.equal(recovered.busy, null);
  assert.equal(recovered.name, content.name);
  assert.equal(recovered.bio, content.bio);
  assert.equal(recovered.textColor, content.textColor);
  compareGeometry(content.geometry, recovered.geometry);
  report.checks.push('Content, focus and geometry recover after loading');

  const errors = await browser('errors');
  assert.ok(Array.isArray(errors.errors), 'Missing browser error log');
  assert.deepEqual(errors.errors, [], 'Uncaught browser errors');
  report.checks.push('No uncaught browser errors');
  report.status = 'passed';
} catch (error) {
  report.status = 'failed';
  report.error = error.stack ?? String(error);
  process.exitCode = 1;
  if (browserAttempted) {
    try {
      await browser('screenshot', '--full', `${evidence}/failure.png`);
    } catch (screenshotError) {
      report.failureScreenshotError = String(screenshotError);
    }
  }
} finally {
  const cleanup = [];
  if (browserAttempted) cleanup.push(['browser', () => browser('close')]);
  if (server) cleanup.push(['server', () => server.close()]);
  report.cleanup = {};
  for (const [name, close] of cleanup) {
    try {
      await close();
      report.cleanup[name] = 'closed';
    } catch (error) {
      report.cleanup[name] = String(error);
      report.status = 'failed';
      process.exitCode = 1;
    }
  }
  report.finishedAt = new Date().toISOString();
  await writeFile(`${evidence}/report.json`, `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${report.status.toUpperCase()} ${evidence}/report.json\n`);
}
