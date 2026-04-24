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
  title: 'EnergyGrid',
  tagline: 'Empowering Utility Customer Engagement',
  favicon: 'img/faviconV2.png',

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
      image: 'img/energygrid-logo.svg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: '',
        logo: {
          alt: 'EnergyGrid',
          src: 'img/energygrid-logo-navbar.svg',
          style: {height: '36px', width: 'auto'},
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            to: '/docs/api/powerbox-api',
            position: 'left',
            label: 'API Reference',
          },
          {
            to: '/blog',
            label: 'Blog',
            position: 'left',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Integration Guide',
                to: '/docs/integration-guide',
              },
              {
                label: 'API Reference',
                to: '/docs/api/powerbox-api',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'Data Dictionary',
                to: '/docs/data-dictionary',
              },
              {
                label: 'Writing Guidelines',
                to: '/docs/writing-guideline',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
            ],
          },
        ],
        copyright: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem; margin-top: 1rem;">
            <div style="display: flex; gap: 1.5rem;">
              <a href="https://www.youtube.com/@EnergyGrid" target="_blank" rel="noopener noreferrer" style="color: #3B82F6; font-size: 1.5rem; transition: color 0.2s;" onmouseover="this.style.color='#2563EB'" onmouseout="this.style.color='#3B82F6'" aria-label="YouTube">
                <i class="fab fa-youtube"></i>
              </a>
              <a href="https://x.com/EnergyGrid" target="_blank" rel="noopener noreferrer" style="color: #3B82F6; font-size: 1.5rem; transition: color 0.2s;" onmouseover="this.style.color='#2563EB'" onmouseout="this.style.color='#3B82F6'" aria-label="X (Twitter)">
                <i class="fab fa-x-twitter"></i>
              </a>
              <a href="https://www.linkedin.com/company/energygrid/" target="_blank" rel="noopener noreferrer" style="color: #3B82F6; font-size: 1.5rem; transition: color 0.2s;" onmouseover="this.style.color='#2563EB'" onmouseout="this.style.color='#3B82F6'" aria-label="LinkedIn">
                <i class="fab fa-linkedin"></i>
              </a>
            </div>
            <div style="opacity: 0.8; font-size: 0.9rem;">
              Copyright © ${new Date().getFullYear()} EnergyGrid Inc. Built with Docusaurus.
            </div>
          </div>
        `,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
