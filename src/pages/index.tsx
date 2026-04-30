import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title" style={{color: 'white'}}>
          Build. Trade. <span style={{color: '#FDDA16'}}>Unify.</span>
        </Heading>
        <p className="hero__subtitle">
          Leverage our trustless infrastructure to create powerful businesses
          that are governed by logic — giving you the freedom to focus on your
          vision, not the operations.
        </p>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Developer documentation for Yellow Network — a decentralized clearing and settlement infrastructure built on state channels. Access SDK guides, protocol specifications, and developer tools supplied by Layer3 Fintech Ltd.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
