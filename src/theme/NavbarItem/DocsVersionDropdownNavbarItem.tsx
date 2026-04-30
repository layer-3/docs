/**
 * Swizzled from @docusaurus/theme-classic.
 *
 * The only change vs upstream: when the user is on the Nitrolite homepage
 * (/nitrolite or /nitrolite/0.5.x), the dropdown links and the trigger label
 * point to the equivalent homepage in the other version, not to the docs
 * default. Everywhere else, behavior is unchanged.
 */

import React, {type ReactNode} from 'react';
import {
  useVersions,
  useActiveDocContext,
  useDocsVersionCandidates,
  useDocsPreferredVersion,
} from '@docusaurus/plugin-content-docs/client';
import {translate} from '@docusaurus/Translate';
import {useHistorySelector} from '@docusaurus/theme-common';
import {useLocation} from '@docusaurus/router';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import type {
  Props,
  PropVersions,
  PropVersionItem,
} from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';
import type {LinkLikeNavbarItemProps} from '@theme/NavbarItem';
import type {
  GlobalVersion,
  GlobalDoc,
  ActiveDocContext,
} from '@docusaurus/plugin-content-docs/client';

type VersionItem = {
  version: GlobalVersion;
  label: string;
};

// Nitrolite homepage paths per version. When the user is on one of these,
// the version dropdown should switch between them instead of jumping into
// the docs.
const NITROLITE_HOMEPAGES: Record<string, string> = {
  current: '/nitrolite',
  '0.5.x': '/nitrolite/0.5.x',
};

function isOnNitroliteHomepage(pathname: string): boolean {
  return Object.values(NITROLITE_HOMEPAGES).some(
    (p) => pathname === p || pathname === `${p}/`,
  );
}

function getVersionItems(
  versions: GlobalVersion[],
  configs?: PropVersions,
): VersionItem[] {
  if (configs) {
    const versionMap = new Map<string, GlobalVersion>(
      versions.map((version) => [version.name, version]),
    );

    const toVersionItem = (
      name: string,
      config?: PropVersionItem,
    ): VersionItem => {
      const version = versionMap.get(name);
      if (!version) {
        throw new Error(
          `No docs version exist for name '${name}'.\nAvailable: ${versions.map((v) => v.name).join(', ')}`,
        );
      }
      return {version, label: config?.label ?? version.label};
    };

    if (Array.isArray(configs)) {
      return configs.map((name) => toVersionItem(name, undefined));
    } else {
      return Object.entries(configs).map(([name, config]) =>
        toVersionItem(name, config),
      );
    }
  } else {
    return versions.map((version) => ({version, label: version.label}));
  }
}

function useVersionItems({
  docsPluginId,
  configs,
}: {
  docsPluginId: Props['docsPluginId'];
  configs: Props['versions'];
}): VersionItem[] {
  const versions = useVersions(docsPluginId);
  return getVersionItems(versions, configs);
}

function getVersionMainDoc(version: GlobalVersion): GlobalDoc {
  return version.docs.find((doc) => doc.id === version.mainDocId)!;
}

function getVersionTargetPath(
  version: GlobalVersion,
  activeDocContext: ActiveDocContext,
  onHomepage: boolean,
): string {
  if (onHomepage && NITROLITE_HOMEPAGES[version.name]) {
    return NITROLITE_HOMEPAGES[version.name]!;
  }
  return (
    activeDocContext.alternateDocVersions[version.name]?.path ??
    getVersionMainDoc(version).path
  );
}

function useDisplayedVersionItem({
  docsPluginId,
  versionItems,
}: {
  docsPluginId: Props['docsPluginId'];
  versionItems: VersionItem[];
}): VersionItem {
  const candidates = useDocsVersionCandidates(docsPluginId);
  const candidateItems = candidates
    .map((candidate) => versionItems.find((vi) => vi.version === candidate))
    .filter((vi) => vi !== undefined);
  return candidateItems[0] ?? versionItems[0]!;
}

export default function DocsVersionDropdownNavbarItem({
  mobile,
  docsPluginId,
  dropdownActiveClassDisabled,
  dropdownItemsBefore,
  dropdownItemsAfter,
  versions: configs,
  ...props
}: Props): ReactNode {
  const search = useHistorySelector((history) => history.location.search);
  const hash = useHistorySelector((history) => history.location.hash);
  const {pathname} = useLocation();
  const activeDocContext = useActiveDocContext(docsPluginId);
  const {savePreferredVersionName} = useDocsPreferredVersion(docsPluginId);
  const versionItems = useVersionItems({docsPluginId, configs});
  const displayedVersionItem = useDisplayedVersionItem({
    docsPluginId,
    versionItems,
  });

  const onHomepage = isOnNitroliteHomepage(pathname);

  function versionItemToLink({
    version,
    label,
  }: VersionItem): LinkLikeNavbarItemProps {
    const targetPath = getVersionTargetPath(version, activeDocContext, onHomepage);
    return {
      label,
      to: `${targetPath}${search}${hash}`,
      isActive: () => version === activeDocContext.activeVersion,
      onClick: () => savePreferredVersionName(version.name),
    };
  }

  const items: LinkLikeNavbarItemProps[] = [
    ...dropdownItemsBefore,
    ...versionItems.map(versionItemToLink),
    ...dropdownItemsAfter,
  ];

  const dropdownLabel =
    mobile && items.length > 1
      ? translate({
          id: 'theme.navbar.mobileVersionsDropdown.label',
          message: 'Versions',
          description:
            'The label for the navbar versions dropdown on mobile view',
        })
      : displayedVersionItem.label;

  const dropdownTo =
    mobile && items.length > 1
      ? undefined
      : getVersionTargetPath(displayedVersionItem.version, activeDocContext, onHomepage);

  if (items.length <= 1) {
    return (
      <DefaultNavbarItem
        {...props}
        mobile={mobile}
        label={dropdownLabel}
        to={dropdownTo}
        isActive={dropdownActiveClassDisabled ? () => false : undefined}
      />
    );
  }

  return (
    <DropdownNavbarItem
      {...props}
      mobile={mobile}
      label={dropdownLabel}
      to={dropdownTo}
      items={items}
      isActive={dropdownActiveClassDisabled ? () => false : undefined}
    />
  );
}
