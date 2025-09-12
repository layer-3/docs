import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  imageSrc: string;
  description: ReactNode;
  link: string;
  isExternal?: boolean;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Learn the Basics',
    imageSrc: require('@site/static/img/icons/learn.png').default,
    description: (
      <>
        Understand the fundamentals of Yellow Network, its architecture,
        and how decentralized clearing and settlement works.
      </>
    ),
    link: '/docs/learn',
  },
  {
    title: 'Build a Yellow App',
    imageSrc: require('@site/static/img/icons/build.png').default,
    description: (
      <>
        Create decentralized applications using Yellow SDK with real-time
        trading capabilities and instant cross-chain settlements.
      </>
    ),
    link: '/docs/build/quick-start',
  },
  {
    title: 'Run a Clearnode',
    imageSrc: require('@site/static/img/icons/clearnode.png').default,
    description: (
      <>
        Set up and operate a clearnode to participate in the network,
        earn rewards, and contribute to decentralized infrastructure.
      </>
    ),
    link: '/docs/manuals',
  },
  {
    title: 'Join the Community',
    imageSrc: require('@site/static/img/icons/community.png').default,
    description: (
      <>
        Connect with developers, traders, and node operators in our
        Discord community and contribute to the ecosystem.
      </>
    ),
    link: 'https://discord.com/invite/yellownetwork',
    isExternal: true,
  },
  {
    title: 'Apply for Grants',
    imageSrc: require('@site/static/img/icons/grants.png').default,
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

function Feature({title, imageSrc, description, link, isExternal}: FeatureItem) {
  const linkProps = isExternal 
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : { to: link };

  return (
    <div className={clsx('col col--4 col--sm-6 col--md-4', styles.featureCol)}>
      <Link 
        {...linkProps}
        className={styles.featureLink}
      >
        <div className={styles.featureContent}>
          <div className={styles.featureSquare}>
            <img src={imageSrc} alt={title} className={styles.featureIcon} />
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
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
