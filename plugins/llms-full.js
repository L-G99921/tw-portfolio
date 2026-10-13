// Builds /llms-full.txt: the Markdown source of every page listed in
// static/llms.txt, concatenated, so a chatbot or retrieval pipeline can ingest
// the whole site in one request. Runs after every build, so it can't go stale.
const fs = require('fs');
const path = require('path');

module.exports = function llmsFullPlugin(context) {
  return {
    name: 'llms-full',
    async postBuild({outDir}) {
      const siteDir = context.siteDir;
      const base = `${context.siteConfig.url}${context.siteConfig.baseUrl}`;
      const index = fs.readFileSync(path.join(siteDir, 'static', 'llms.txt'), 'utf8');

      // Every docs or blog URL in llms.txt maps back to a source file.
      const urls = [...index.matchAll(/\]\((https:\/\/l-g99921\.github\.io\/tw-portfolio\/[^)]*)\)/g)].map((m) => m[1]);
      const sources = [];
      for (const url of urls) {
        const route = url.slice(base.length).replace(/\/$/, '');
        const candidates = route.startsWith('docs/')
          ? [`${route}.md`, `${route}.mdx`, `${route}/index.md`, `${route}.info.mdx`].map((p) => path.join(siteDir, p))
          : route.startsWith('blog/')
            ? fs.readdirSync(path.join(siteDir, 'blog')).filter((f) => f.endsWith(route.slice(5) + '.md')).map((f) => path.join(siteDir, 'blog', f))
            : [];
        // API overview pages are generated; use the spec's own description instead.
        const file = candidates.find((p) => fs.existsSync(p));
        if (file && !file.endsWith('.info.mdx')) sources.push({url, file});
      }

      const parts = [`# Leandro Gabriel, technical writing portfolio: full text\n\nSource: ${base}llms.txt\n`];
      for (const {url, file} of sources) {
        const body = fs.readFileSync(file, 'utf8').replace(/^---[\s\S]*?---\s*/, '').trim();
        parts.push(`\n\n---\n\nURL: ${url}\n\n${body}`);
      }
      for (const spec of ['openapi.json', 'usage-api-openapi.json', 'pix-api-openapi.json']) {
        const j = JSON.parse(fs.readFileSync(path.join(siteDir, 'static', spec), 'utf8'));
        parts.push(`\n\n---\n\nURL: ${base}${spec}\n\n# ${j.info.title}\n\n${j.info.description}`);
      }

      fs.writeFileSync(path.join(outDir, 'llms-full.txt'), parts.join('') + '\n');
      console.log(`[llms-full] ${sources.length} pages written to llms-full.txt`);
    },
  };
};
