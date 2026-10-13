// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {string | undefined} */
const measurementId = process.env.GA_MEASUREMENT_ID;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Leandro Gabriel, Senior Technical Writer',
  tagline: 'API references, integration guides, and the docs-as-code pipelines behind them',
  favicon: 'img/favicon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://l-g99921.github.io',
  baseUrl: '/tw-portfolio/',
  organizationName: 'L-G99921',
  projectName: 'tw-portfolio',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  // Geist and Geist Mono, the same typefaces as leandrogabriel.vercel.app
  headTags: [
    {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'}},
    {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous'}},
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Geist:wght@400..700&family=Geist+Mono:wght@400..600&display=swap',
  ],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid', 'docusaurus-theme-openapi-docs'],

  plugins: [
    'docusaurus-plugin-sass',
    './plugins/llms-full.js',
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'api',
        docsPluginId: 'classic',
        config: {
          powerbox: {
            specPath: 'static/openapi.json',
            outputDir: 'docs/api',
            sidebarOptions: {
              groupPathsBy: 'tag',
            },
          },
          usageapi: {
            specPath: 'static/usage-api-openapi.json',
            outputDir: 'docs/api/usage-api',
            sidebarOptions: {
              groupPathsBy: 'tag',
            },
          },
          pixapi: {
            specPath: 'static/pix-api-openapi.json',
            outputDir: 'docs/api/pix-api',
            sidebarOptions: {
              groupPathsBy: 'tag',
            },
          },
        },
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          docItemComponent: '@theme/ApiItem',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: measurementId
          ? {
              trackingID: measurementId,
              anonymizeIP: true,
            }
          : undefined,
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/og.png',
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Leandro Gabriel',
        logo: {
          alt: '',
          src: 'img/lg-mark.svg',
          width: 32,
          height: 32,
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Work samples',
          },
          {
            to: '/docs/api/pix-api/instant-payments-api-pix-sample',
            position: 'left',
            label: 'Try the API',
          },
          {
            to: '/docs/pix/about-pix',
            position: 'left',
            label: 'PIX',
          },
          {
            to: '/blog',
            label: 'Blog',
            position: 'left',
          },
          {
            href: 'https://www.linkedin.com/in/leandro-gabriel-8aab31167/',
            label: 'LinkedIn',
            position: 'right',
          },
          {
            href: 'https://github.com/L-G99921',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      // The footer is rendered by src/theme/Footer, which replaces this block.
      // Order of the code samples on API pages: cURL first.
      languageTabs: [
        {highlight: 'bash', language: 'curl', logoClass: 'curl'},
        {highlight: 'python', language: 'python', logoClass: 'python'},
        {highlight: 'javascript', language: 'nodejs', logoClass: 'nodejs'},
        {highlight: 'go', language: 'go', logoClass: 'go'},
        {highlight: 'java', language: 'java', logoClass: 'java', variant: 'unirest'},
        {highlight: 'csharp', language: 'csharp', logoClass: 'csharp'},
      ],
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.vsDark,
      },
    }),
};

export default config;
