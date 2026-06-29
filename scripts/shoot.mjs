import { chromium } from 'playwright';
import { setTimeout as sleep } from 'node:timers/promises';

const BASE = process.env.BASE || 'http://localhost:4173';
const OUT = process.env.OUT || '/tmp/claude-0/-home-user-portfolio/42453b4b-19a6-5e13-bfbe-237400d76d6d/scratchpad/shots';
const ROUTES = ['/', '/connect', '/projects', '/experience', '/studies', '/cv'];
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const execPath = '/opt/pw-browsers/chromium';
import fs from 'node:fs';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: fs.existsSync(execPath) ? execPath : undefined,
});

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log(`  [pageerror ${vp.name}] ${e.message}`));
  for (const route of ROUTES) {
    const url = BASE + route;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 }).catch(() => {});
      await sleep(2800); // let intro animations settle
      const name = (route === '/' ? 'home' : route.slice(1)).replace(/\//g, '_');
      const file = `${OUT}/${name}-${vp.name}.png`;
      await page.screenshot({ path: file, fullPage: false });
      console.log(`shot ${file}`);
    } catch (e) {
      console.log(`FAIL ${url}: ${e.message}`);
    }
  }
  await ctx.close();
}
await browser.close();
console.log('done');
