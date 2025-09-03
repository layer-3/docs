import React, {useMemo} from 'react';
import {useLocation} from '@docusaurus/router';
import type {Props} from '@theme/DocSidebar';
import DocSidebar from '@theme-original/DocSidebar';

function CustomDocSidebar(props: Props): JSX.Element {
  const location = useLocation();
  
  const filteredSidebar = useMemo(() => {
    if (!props.sidebar) return null;
    
    // Determine current section from pathname
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const currentSection = pathSegments[1]; // docs/[section]/...
    
    if (!currentSection || currentSection === 'docs') {
      return props.sidebar;
    }
    
    // Filter sidebar items to show only current section
    const filteredItems = props.sidebar.filter((item) => {
      if (item.type === 'category') {
        // Check if category belongs to current section by examining the category's items
        return item.items && item.items.some((subItem: any) => {
          const subItemPath = subItem.href || subItem.id || '';
          return subItemPath.includes(currentSection);
        });
      }
      
      if (item.type === 'doc') {
        const itemPath = (item as any).href || (item as any).id || '';
        return itemPath.includes(currentSection);
      }
      
      if (item.type === 'link') {
        const itemPath = (item as any).href || '';
        return itemPath.includes(currentSection);
      }
      
      return false;
    });
    
    return filteredItems;
  }, [props.sidebar, location.pathname]);

  return <DocSidebar {...props} sidebar={filteredSidebar} />;
}

export default CustomDocSidebar;