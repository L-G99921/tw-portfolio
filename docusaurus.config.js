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
  title: 'Leandro Gabriel — Technical Writer',
  tagline: 'Turning complex systems into clear, developer-first documentation',
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
      image: 'img/lg-logo.svg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: '',
        logo: {
          alt: 'Leandro Gabriel — Technical Writer',
          src: 'img/lg-logo-navbar.svg',
          style: {height: '36px', width: 'auto'},
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Portfolio',
          },
          {
            to: '/docs/api/powerbox-api',
            position: 'left',
            label: 'API Sample',
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
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Portfolio',
            items: [
              {
                label: 'Featured Project',
                to: '/docs',
              },
              {
                label: 'Integration Guide',
                to: '/docs/integration-guide',
              },
              {
                label: 'API Reference Sample',
                to: '/docs/api/powerbox-api',
              },
            ],
          },
          {
            title: 'Samples',
            items: [
              {
                label: 'Hardware Install Guide',
                to: '/docs/energy-bridge/energy-bridge-installation-guide-atlas-insight',
              },
              {
                label: 'Writing Style Guide',
                to: '/docs/writing-guideline',
              },
              {
                label: 'Data Dictionary',
                to: '/docs/data-dictionary',
              },
            ],
          },
          {
            title: 'Connect',
            items: [
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/in/leandro-gabriel-8aab31167/',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/L-G99921',
              },
              {
                label: 'Email',
                href: 'mailto:lgos99921@gmail.com',
              },
            ],
          },
        ],
        copyright: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem; margin-top: 1rem;">
            <div style="display: flex; gap: 1.5rem;">
              <a href="https://www.linkedin.com/in/leandro-gabriel-8aab31167/" target="_blank" rel="noopener noreferrer" style="color: #A78BFA; font-size: 1.5rem; transition: color 0.2s;" onmouseover="this.style.color='#8B5CF6'" onmouseout="this.style.color='#A78BFA'" aria-label="LinkedIn">
                <i class="fab fa-linkedin"></i>
              </a>
              <a href="https://github.com/L-G99921" target="_blank" rel="noopener noreferrer" style="color: #A78BFA; font-size: 1.5rem; transition: color 0.2s;" onmouseover="this.style.color='#8B5CF6'" onmouseout="this.style.color='#A78BFA'" aria-label="GitHub">
                <i class="fab fa-github"></i>
              </a>
              <a href="mailto:lgos99921@gmail.com" style="color: #A78BFA; font-size: 1.5rem; transition: color 0.2s;" onmouseover="this.style.color='#8B5CF6'" onmouseout="this.style.color='#A78BFA'" aria-label="Email">
                <i class="fas fa-envelope"></i>
              </a>
            </div>
            <div style="opacity: 0.8; font-size: 0.9rem;">
              Copyright © ${new Date().getFullYear()} Leandro Gabriel Oliveira de Souza. Built with Docusaurus.
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
