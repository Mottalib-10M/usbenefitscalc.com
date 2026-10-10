import { it } from 'vitest';
import { PAGES } from '../src/lib/pages';
import { helpers } from '../src/lib/helpers';
import { writeFileSync } from 'fs';
const words = (s: string) => s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
it('preview', () => {
  const h = helpers();
  const only = (process.env.PAGE_FILES ?? '').split(',').filter(Boolean);
  let out = '';
  for (const p of PAGES.filter((x) => only.includes(x.id))) {
    const b = p.body(h);
    const prose = b.replace(/<table[\s\S]*?<\/table>/g, '');
    out += `=== ${p.id} title=${p.title.length} desc=${p.description.length} resume=${words(p.resume)} body=${words(prose)} h2=${(b.match(/<h2>/g) || []).length}\nTITLE ${p.title}\nDESC ${p.description}\nRESUME ${p.resume}\n${b.replace(/<div class="not-prose[\s\S]*?<\/div>/g, (m) => '\n[TABLE] ' + m.replace(/<\/tr>/g, '\n').replace(/<[^>]+>/g, ' | ').replace(/( \| )+/g, ' | ') + '\n').replace(/<a [^>]*>/g, '[').replace(/<\/a>/g, ']')}\nFAQ\n${p.faqs.map((f) => `Q ${f.q}\nA ${f.a}`).join('\n')}\n\n`;
  }
  writeFileSync('/private/tmp/claude-501/-Users-mottalib/1c47d563-10d7-40de-a270-587b5ea41e8a/scratchpad/preview.txt', out);
});
