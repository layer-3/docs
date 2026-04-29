/**
 * Swizzled from @docusaurus/theme-classic/src/theme/Navbar/Content/index.tsx
 *
 * Adds path-based filtering: navbar items with `customProps.showOn` are only
 * rendered on matching sub-sites (`nitrolite` | `clearnet` | `all`).
 * Items without `customProps.showOn` are always rendered.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {
  useThemeConfig,
  ErrorCauseBoundary,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {
  splitNavbarItems,
  useNavbarMobileSidebar,
} from '@docusaurus/theme-common/internal';
import NavbarItem, {type Props as NavbarItemConfig} from '@theme/NavbarItem';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import SearchBar from '@theme/SearchBar';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import NavbarLogo from '@theme/Navbar/Logo';
import NavbarSearch from '@theme/Navbar/Search';

import styles from './styles.module.css';

type ShowOn = 'nitrolite' | 'clearnet' | 'portal' | 'all';

// Subsite homepages: where the badge link and breadcrumb home should land.
// /clearnet has no dedicated homepage yet; falls back to its first doc.
const SUBSITE_HOME: Record<'nitrolite' | 'clearnet', string> = {
  nitrolite: '/nitrolite',
  clearnet: '/clearnet/introduction',
};

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

function currentSubsite(pathname: string): 'nitrolite' | 'clearnet' | 'portal' {
  if (pathname.startsWith('/nitrolite')) return 'nitrolite';
  if (pathname.startsWith('/clearnet')) return 'clearnet';
  return 'portal';
}

function shouldShowItem(item: NavbarItemConfig, pathname: string): boolean {
  const customProps = (item as {customProps?: {showOn?: ShowOn; hideOnPaths?: string[]}}).customProps;
  const showOn = customProps?.showOn;
  if (showOn && showOn !== 'all' && showOn !== currentSubsite(pathname)) {
    return false;
  }
  if (customProps?.hideOnPaths?.some((p) => pathname === p || pathname === `${p}/`)) {
    return false;
  }
  return true;
}

function SubsiteBadge({sub}: {sub: 'nitrolite' | 'clearnet' | 'portal'}) {
  if (sub === 'portal') return null;
  const label = sub === 'nitrolite' ? 'Nitrolite' : 'Clearnet';
  return (
    <Link
      to={SUBSITE_HOME[sub]}
      className={styles.subsiteBadge}
      aria-label={`${label} home`}>
      {label}
    </Link>
  );
}

function NavbarItems({items}: {items: NavbarItemConfig[]}): ReactNode {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={(error) =>
            new Error(
              `A theme navbar item failed to render.
Please double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:
${JSON.stringify(item, null, 2)}`,
              {cause: error},
            )
          }>
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
  );
}

function NavbarContentLayout({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="navbar__inner">
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerLeft,
          'navbar__items',
        )}>
        {left}
      </div>
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerRight,
          'navbar__items navbar__items--right',
        )}>
        {right}
      </div>
    </div>
  );
}

export default function NavbarContent(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const {pathname} = useLocation();

  const items = useNavbarItems();
  const filteredItems = items.filter((item) => shouldShowItem(item, pathname));
  const [leftItems, rightItems] = splitNavbarItems(filteredItems);

  const searchBarItem = items.find((item) => item.type === 'search');
  const sub = currentSubsite(pathname);

  return (
    <NavbarContentLayout
      left={
        <>
          {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
          <NavbarLogo />
          <SubsiteBadge sub={sub} />
          <NavbarItems items={leftItems} />
        </>
      }
      right={
        <>
          <NavbarItems items={rightItems} />
          <NavbarColorModeToggle className={styles.colorModeToggle} />
          {!searchBarItem && (
            <NavbarSearch>
              <SearchBar />
            </NavbarSearch>
          )}
        </>
      }
    />
  );
}
