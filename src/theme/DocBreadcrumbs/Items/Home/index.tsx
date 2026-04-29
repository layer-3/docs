/**
 * Swizzled from @docusaurus/theme-classic.
 * The home icon points to the current sub-site's homepage instead of the
 * global root: /nitrolite/* → /nitrolite, /clearnet/* → /clearnet/introduction.
 */

import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {translate} from '@docusaurus/Translate';
import IconHome from '@theme/Icon/Home';

import styles from './styles.module.css';

function subsiteHome(pathname: string): string {
  // Match the most specific Nitrolite version path first so /nitrolite/0.5.x/*
  // breadcrumbs land on the 0.5.x homepage instead of the v1 homepage.
  if (pathname.startsWith('/nitrolite/0.5.x')) return '/nitrolite/0.5.x';
  if (pathname.startsWith('/nitrolite')) return '/nitrolite';
  if (pathname.startsWith('/clearnet')) return '/clearnet/introduction';
  return '/';
}

export default function HomeBreadcrumbItem(): ReactNode {
  const {pathname} = useLocation();
  const homeHref = useBaseUrl(subsiteHome(pathname));

  return (
    <li className="breadcrumbs__item">
      <Link
        aria-label={translate({
          id: 'theme.docs.breadcrumbs.home',
          message: 'Home page',
          description: 'The ARIA label for the home page in the breadcrumbs',
        })}
        className="breadcrumbs__link"
        href={homeHref}>
        <IconHome className={styles.breadcrumbHomeIcon} />
      </Link>
    </li>
  );
}
