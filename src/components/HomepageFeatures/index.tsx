import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useColorMode} from '@docusaurus/theme-common';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  imageSrc: string;
  imageSrcDark: string;
  description: ReactNode;
  link: string;
  isExternal?: boolean;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Nitrolite',
    imageSrc: require('@site/static/img/themes/light/icons/build.png').default,
    imageSrcDark: require('@site/static/img/themes/dark/icons/build.png').default,
    description: (
      <>
        State channel SDK for building decentralized apps with instant
        finality, real-time trading, and cross-chain settlement.
      </>
    ),
    link: '/nitrolite',
  },
  {
    title: 'Clearnet',
    imageSrc: require('@site/static/img/themes/light/icons/clearnode.png').default,
    imageSrcDark: require('@site/static/img/themes/dark/icons/clearnode.png').default,
    description: (
      <>
        Decentralized clearing and settlement protocol — peer-to-peer overlay
        network, smart contracts, governance, and node operations.
      </>
    ),
    link: '/clearnet/introduction',
  },
];

function Feature({title, imageSrc, imageSrcDark, description, link, isExternal}: FeatureItem) {
  const {colorMode} = useColorMode();
  const currentImageSrc = colorMode === 'dark' ? imageSrcDark : imageSrc;
  
  const linkProps = isExternal 
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : { to: link };

  return (
    <div className={clsx('col col--4', styles.featureCol)}>
      <Link 
        {...linkProps}
        className={styles.featureLink}
      >
        <div className={styles.featureContent}>
          <div className={styles.featureSquare}>
            <img src={currentImageSrc} alt={title} className={styles.featureIcon} />
          </div>
          <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
          <p className={styles.featureDescription}>{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row" style={{justifyContent: 'center'}}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
