import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const isDev = process.env.NODE_ENV === 'development';
const baseUrl = '/';

const config: Config = {
  title: 'Yellow Network',
  tagline: 'Decentralized clearing and settlement network.\nDevelop Yellow Apps with instant finality.',
  favicon: 'img/favicon.ico',

  customFields: {
    packageVersion: require('./package.json').version,
  },

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: isDev ? 'http://localhost:3000' : 'https://docs.yellow.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'layer-3', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // SEO metadata - injected into HTML head
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content: 'Build Yellow Apps with the Yellow SDK - a real-time communication toolkit for decentralized clearing and settlement. Create applications with unified cross-chain balance and instant finality.',
      },
    },
  ],

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
          routeBasePath: '/docs',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          sidebarCollapsed: false,
          sidebarCollapsible: false,
          breadcrumbs: true,
          includeCurrentVersion: true,
          versions: {
            current: {
              label: require('./package.json').version,
              path: '', // Root path (docs/)
              banner: 'none',
            },
          },
        },
        blog: false,
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
      'docusaurus-lunr-search',
      {
        languages: ['en'],
      },
    ],
  ],


  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'Yellow Network',
        src: 'img/themes/light/logo.svg',
        srcDark: 'img/themes/dark/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'learn/index',
          label: 'Learn',
          position: 'left',
        },
        {
          type: 'doc',
          docId: 'build/quick-start/index',
          label: 'Build',
          position: 'left',
        },
        {
          type: 'doc',
          docId: 'protocol/introduction',
          label: 'Protocol',
          position: 'left',
        },
        {
          type: 'doc',
          docId: 'manuals/index',
          label: 'Manuals',
          position: 'left',
        },
        {
          type: 'doc',
          docId: 'guides/index',
          label: 'Guides',
          position: 'left',
        },
        {
          to: '/whitepaper',
          label: 'Whitepaper',
          position: 'left',
        },
        {
          href: 'https://github.com/layer-3',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          className: 'navbar-version-dropdown',
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
                <img src="/img/themes/light/logo.svg" alt="Yellow Network" style="width: 80px; margin-bottom: 20px; margin-left: 0;" class="footer-logo-light" />
                <img src="/img/themes/dark/logo.svg" alt="Yellow Network" style="width: 80px; margin-bottom: 20px; margin-left: 0; display: none;" class="footer-logo-dark" />
              `,
            },
          ],
        },
        {
          title: 'Docs',
          items: [
            {
              label: 'Learn',
              to: '/docs/learn',
            },
            {
              label: 'Build',
              to: '/docs/build/quick-start',
            },
            {
              label: 'Manuals',
              to: '/docs/manuals',
            },
            {
              label: 'Guides',
              to: '/docs/guides',
            },
            {
              label: 'Whitepaper',
              to: '/whitepaper',
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
      additionalLanguages: ['bash', 'diff', 'json', 'go', 'typescript'],
      defaultLanguage: 'javascript',
      magicComments: [
        {
          className: 'git-diff-remove',
          line: 'remove-next-line',
          block: { start: 'remove-start', end: 'remove-end' },
        },
        {
          className: 'git-diff-add',
          line: 'add-next-line',
          block: { start: 'add-start', end: 'add-end' },
        },
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' },
        },
      ],
    },
    mermaid: {
      theme: {
        light: 'default',
        dark: 'default',
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
