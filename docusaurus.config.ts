import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const isDev = process.env.NODE_ENV === 'development';
const baseUrl = '/';

const config: Config = {
  title: 'Yellow Network',
  tagline: 'Decentralized clearing and settlement network.\nDevelop Yellow Apps with instant finality.',
  favicon: 'img/favicon.svg',

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
          path: './docs/nitrolite',
          sidebarPath: './sidebars-nitrolite.ts',
          routeBasePath: '/nitrolite',
          editUrl:
            'https://github.com/layer-3/docs/tree/master/',
          sidebarCollapsed: false,
          sidebarCollapsible: false,
          breadcrumbs: true,
          includeCurrentVersion: true,
          versions: {
            current: {
              label: '1.x',
              path: '',
              banner: 'none',
            },
            '0.5.x': {
              label: '0.5.x',
              path: '0.5.x',
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
      '@docusaurus/plugin-content-docs',
      {
        id: 'clearnet',
        path: './docs/clearnet',
        routeBasePath: '/clearnet',
        sidebarPath: './sidebars-clearnet.ts',
        editUrl: 'https://github.com/layer-3/docs/tree/master/',
        sidebarCollapsed: false,
        sidebarCollapsible: false,
        breadcrumbs: true,
        // No versions block — Clearnet starts unversioned
      },
    ],
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
        // Portal-only product entry links
        {
          to: '/nitrolite/learn',
          label: 'Nitrolite',
          position: 'left',
          customProps: { showOn: 'portal' },
        },
        {
          to: '/clearnet/introduction',
          label: 'Clearnet',
          position: 'left',
          customProps: { showOn: 'portal' },
        },
        // Nitrolite navbar items (shown on /nitrolite/*)
        {
          type: 'doc',
          docId: 'learn/index',
          label: 'Learn',
          position: 'left',
          customProps: { showOn: 'nitrolite' },
        },
        {
          type: 'doc',
          docId: 'build/quick-start/index',
          label: 'Build',
          position: 'left',
          customProps: { showOn: 'nitrolite' },
        },
        {
          type: 'doc',
          docId: 'protocol/terminology',
          label: 'Protocol',
          position: 'left',
          customProps: { showOn: 'nitrolite' },
        },
        // Clearnet navbar items (shown on /clearnet/*)
        {
          type: 'doc',
          docsPluginId: 'clearnet',
          docId: 'introduction',
          label: 'Introduction',
          position: 'left',
          customProps: { showOn: 'clearnet' },
        },
        {
          type: 'doc',
          docsPluginId: 'clearnet',
          docId: 'architecture',
          label: 'Architecture',
          position: 'left',
          customProps: { showOn: 'clearnet' },
        },
        {
          type: 'doc',
          docsPluginId: 'clearnet',
          docId: 'decentralized-layer/overview',
          label: 'Decentralized Layer',
          position: 'left',
          customProps: { showOn: 'clearnet' },
        },
        {
          type: 'doc',
          docsPluginId: 'clearnet',
          docId: 'contracts/index',
          label: 'Contracts',
          position: 'left',
          customProps: { showOn: 'clearnet' },
        },
        // Whitepaper only on portal
        {
          to: '/whitepaper',
          label: 'Whitepaper',
          position: 'left',
          customProps: { showOn: 'portal' },
        },
        // GitHub link visible on all sub-sites
        {
          href: 'https://github.com/layer-3',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
          customProps: { showOn: 'all' },
        },
        // Version dropdown only on Nitrolite (Clearnet is unversioned)
        {
          type: 'docsVersionDropdown',
          position: 'right',
          className: 'navbar-version-dropdown',
          customProps: { showOn: 'nitrolite' },
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
          title: 'Nitrolite',
          items: [
            {
              label: 'Learn',
              to: '/nitrolite/learn',
            },
            {
              label: 'Build',
              to: '/nitrolite/build/quick-start',
            },
            {
              label: 'Protocol',
              to: '/nitrolite/protocol/terminology',
            },
          ],
        },
        {
          title: 'Clearnet',
          items: [
            {
              label: 'Introduction',
              to: '/clearnet/introduction',
            },
            {
              label: 'Architecture',
              to: '/clearnet/architecture',
            },
            {
              label: 'Contracts',
              to: '/clearnet/contracts',
            },
          ],
        },
        {
          title: 'More',
          items: [
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
