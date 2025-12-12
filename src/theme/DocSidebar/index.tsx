import React, { type ReactNode } from 'react';
import OriginalSidebar from '@theme-original/DocSidebar';
import { useVersions, useActiveVersion } from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
// @ts-ignore - CSS modules are not typed by default in docusaurus setup without extra config
import styles from './styles.module.css';
import type { PropSidebar } from '@docusaurus/plugin-content-docs';

type Props = {
  path: string;
  sidebar: PropSidebar;
  onCollapse: () => void;
  isHidden: boolean;
  [key: string]: any;
};

function VersionSwitcher() {
  const { siteConfig } = useDocusaurusContext();
  const versions = useVersions();
  const activeVersion = useActiveVersion();
  const currentVersionLabel = (siteConfig.customFields?.packageVersion as string) || 'Next';
  
  return (
    <div className={styles.versionSwitcher}>
      <a 
        href="https://github.com/layer-3/docs" 
        target="_blank" 
        className={styles.githubLink}
        rel="noopener noreferrer"
        aria-label="GitHub Repository"
      >
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path 
            fill="currentColor" 
            d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
          />
        </svg>
      </a>
      <select 
        value={activeVersion?.name || 'current'}
        onChange={(e) => {
          const version = versions.find(v => v.name === e.target.value);
          if (version) {
            const currentPath = window.location.pathname;
            const activeVersionPath = activeVersion?.path || '';
            const targetVersionPath = version.path;

            // Logic to preserve the current doc path suffix
            let newPath;
            if (activeVersionPath === '' && targetVersionPath !== '') {
               if (currentPath.startsWith(activeVersionPath)) {
                 newPath = currentPath.replace(activeVersionPath, targetVersionPath);
               } 
            } else if (activeVersionPath !== '' && targetVersionPath === '') {
                newPath = currentPath.replace(activeVersionPath, targetVersionPath);
            } else {
                newPath = currentPath.replace(activeVersionPath, targetVersionPath);
            }
            
            if (!newPath) {
                 newPath = targetVersionPath === '' ? '/' : targetVersionPath;
            }
            
            // Hack for the specific 404 root issue:
            if (newPath === '/docs/next' || newPath === '/docs/next/') {
                newPath = '/docs/next/learn';
            }

            window.location.href = newPath;
          }
        }}
        className={styles.versionSelect}
      >
        {versions.map((version) => (
          <option key={version.name} value={version.name}>
             {version.name === 'current' ? currentVersionLabel : version.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function DocSidebarWrapper(props: Props): ReactNode {
  return (
    <>
      <VersionSwitcher />
      <OriginalSidebar {...props} />
    </>
  );
}