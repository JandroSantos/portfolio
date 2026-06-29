import { chromium } from 'playwright';
import fs from 'node:fs';
const ep='/opt/pw-browsers/chromium';
const b=await chromium.launch({executablePath:fs.existsSync(ep)?ep:undefined});
const p=await b.newContext({viewport:{width:1440,height:900}}).then(c=>c.newPage());
await p.goto('http://localhost:4173/experience',{waitUntil:'networkidle'}).catch(()=>{});
await new Promise(r=>setTimeout(r,1500));
const info=await p.evaluate(()=>{
  const out=[];
  const h=[...document.querySelectorAll('h3')].find(e=>/Monitor/.test(e.textContent));
  let el=h; let depth=0;
  while(el && depth<9){const r=el.getBoundingClientRect();const cs=getComputedStyle(el);out.push(`${depth} <${el.tagName} class="${(el.className||'').toString().slice(0,46)}"> x=${Math.round(r.x)} w=${Math.round(r.width)} disp=${cs.display} mw=${cs.maxWidth} ml=${cs.marginLeft} mr=${cs.marginRight}`);el=el.parentElement;depth++;}
  return out.join('\n');
});
console.log(info);
await b.close();
