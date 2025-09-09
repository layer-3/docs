import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Yellow Network',
  tagline: 'Decentralized clearing and settlement network.\nDevelop Yellow Apps with instant finality.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'yellow-network', // Usually your GitHub org/user name.
  projectName: 'yellow-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  plugins: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        docsRouteBasePath: '/docs',
      },
    ],
  ],


  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'Yellow Network',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/docs/learn',
          label: 'Learn',
          position: 'left',
        },
        {
          to: '/docs/build/quick-start',
          label: 'Build',
          position: 'left',
        },
        {
          to: '/docs/manuals',
          label: 'Manuals',
          position: 'left',
        },
        {
          to: '/docs/tutorials',
          label: 'Tutorials',
          position: 'left',
        },
        {
          to: '/docs/api-reference',
          label: 'API Reference',
          position: 'left',
        },
        {
          to: '/docs/legacy/',
          label: 'Legacy',
          position: 'left',
        },
        {
          href: 'https://github.com/layer-3',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: ' ',
          items: [
            {
              html: `
                <img src="img/logo.svg" alt="Yellow Network" style="width: 80px; margin-bottom: 20px; margin-left: 0;" />
              `,
            },
          ],
        },
        {
          title: 'Docs',
          items: [
            {
              label: 'Documentation',
              to: '/docs/learn',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.com/invite/yellownetwork',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/layer-3',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'X',
              href: 'https://x.com/YellowCom_News',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Layer3 Fintech Ltd.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
