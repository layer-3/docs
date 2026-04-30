import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useColorMode} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import sharedStyles from '@site/src/pages/index.module.css';
import featureStyles from '@site/src/components/HomepageFeatures/styles.module.css';

type FeatureItem = {
  title: string;
  imageSrc: string;
  imageSrcDark: string;
  description: ReactNode;
  link: string;
  isExternal?: boolean;
};

// 0.5.x cards — includes Clearnode setup, which lived in this version's docs
// before being moved to the Clearnet sub-site.
const FeatureList: FeatureItem[] = [
  {
    title: 'Learn the Basics',
    imageSrc: require('@site/static/img/themes/light/icons/learn.png').default,
    imageSrcDark: require('@site/static/img/themes/dark/icons/learn.png').default,
    description: (
      <>
        Understand the fundamentals of Yellow Network, its architecture,
        and how decentralized clearing and settlement works.
      </>
    ),
    link: '/nitrolite/0.5.x/learn',
  },
  {
    title: 'Build a Yellow App',
    imageSrc: require('@site/static/img/themes/light/icons/build.png').default,
    imageSrcDark: require('@site/static/img/themes/dark/icons/build.png').default,
    description: (
      <>
        Create decentralized applications using Yellow SDK with real-time
        trading capabilities and instant cross-chain settlements.
      </>
    ),
    link: '/nitrolite/0.5.x/build/quick-start',
  },
  {
    title: 'Run a Clearnode',
    imageSrc: require('@site/static/img/themes/light/icons/clearnode.png').default,
    imageSrcDark: require('@site/static/img/themes/dark/icons/clearnode.png').default,
    description: (
      <>
        Set up and operate a clearnode to provide network services
        and contribute to decentralized infrastructure.
      </>
    ),
    link: '/nitrolite/0.5.x/guides/manuals/running-clearnode-locally',
  },
  {
    title: 'Join the Community',
    imageSrc: require('@site/static/img/themes/light/icons/community.png').default,
    imageSrcDark: require('@site/static/img/themes/dark/icons/community.png').default,
    description: (
      <>
        Connect with developers, traders, and node operators in our
        Discord community and contribute to the ecosystem.
      </>
    ),
    link: 'https://t.me/YellowSDKCommunity',
    isExternal: true,
  },
  {
    title: 'Apply for Grants',
    imageSrc: require('@site/static/img/themes/light/icons/grants.png').default,
    imageSrcDark: require('@site/static/img/themes/dark/icons/grants.png').default,
    description: (
      <>
        Get funding support for your Yellow Network project through
        our grants program for innovative applications and integrations.
      </>
    ),
    link: 'https://forms.yellow.org/build',
    isExternal: true,
  },
];

function NitroliteHeader() {
  return (
    <header className={clsx('hero hero--primary', sharedStyles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title" style={{color: 'white'}}>
          Explore the <span style={{color: '#FDDA16'}}>SDK</span>
        </Heading>
        <p className="hero__subtitle">
          Decentralized clearing and settlement network<br />
          Develop Yellow Apps with instant finality.
        </p>
      </div>
    </header>
  );
}

function Feature({title, imageSrc, imageSrcDark, description, link, isExternal}: FeatureItem) {
  const {colorMode} = useColorMode();
  const currentImageSrc = colorMode === 'dark' ? imageSrcDark : imageSrc;

  const linkProps = isExternal
    ? {href: link, target: '_blank', rel: 'noopener noreferrer'}
    : {to: link};

  return (
    <div className={clsx('col col--4 col--sm-6 col--md-4', featureStyles.featureCol)}>
      <Link {...linkProps} className={featureStyles.featureLink}>
        <div className={featureStyles.featureContent}>
          <div className={featureStyles.featureSquare}>
            <img src={currentImageSrc} alt={title} className={featureStyles.featureIcon} />
          </div>
          <Heading as="h3" className={featureStyles.featureTitle}>{title}</Heading>
          <p className={featureStyles.featureDescription}>{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function NitroliteHomeLegacy(): ReactNode {
  return (
    <Layout
      title="Nitrolite (0.5.x)"
      description="Nitrolite 0.5.x — state channel SDK for building decentralized apps with instant finality, real-time trading, and cross-chain settlement.">
      <NitroliteHeader />
      <main>
        <section className={featureStyles.features}>
          <div className="container">
            <div className="row">
              {FeatureList.map((props) => (
                <Feature key={props.title} {...props} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
