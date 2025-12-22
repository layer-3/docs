import React, {type ReactNode} from 'react';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import IconClose from '@theme/Icon/Close';
import NavbarLogo from '@theme/Navbar/Logo';
import DocsVersionDropdownNavbarItem from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';

function CloseButton() {
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <button
      type="button"
      aria-label={translate({
        id: 'theme.docs.sidebar.closeSidebarButtonAriaLabel',
        message: 'Close navigation bar',
        description: 'The ARIA label for close button of mobile sidebar',
      })}
      className="clean-btn navbar-sidebar__close"
      onClick={() => mobileSidebar.toggle()}>
      <IconClose color="var(--ifm-color-emphasis-600)" />
    </button>
  );
}

function GitHubLink() {
  return (
    <a
      href="https://github.com/layer-3"
      target="_blank"
      rel="noopener noreferrer"
      className="navbar__link header-github-link"
      aria-label="GitHub repository"
      style={{
        marginRight: '8px',
        display: 'flex',
        alignItems: 'center',
      }}
    />
  );
}

export default function NavbarMobileSidebarHeader(): ReactNode {
  return (
    <div className="navbar-sidebar__brand">
      <div className="navbar-sidebar__brand-row-main" style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
        <NavbarLogo />
        <CloseButton />
      </div>
      <div className="navbar-sidebar__tools-row" style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <GitHubLink />
          <div className="navbar-version-dropdown">
            <DocsVersionDropdownNavbarItem
              mobile={false}
              items={[]}
              dropdownItemsBefore={[]}
              dropdownItemsAfter={[]}
            />
          </div>
        </div>
        <NavbarColorModeToggle />
      </div>
    </div>
  );
}
