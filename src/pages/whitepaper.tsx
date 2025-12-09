import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Whitepaper(): JSX.Element {
  return (
    <Layout
      title="Whitepaper"
      description="Download the Yellow Network Whitepaper">
      <main className="container margin-vert--xl">
        <div className="row">
          <div className="col col--8 col--offset-2 text--center">
            <h1 className="hero__title margin-bottom--lg">Yellow Network Whitepaper</h1>
            <p className="hero__subtitle margin-bottom--xl">
              Understand the risks, utilities, and compliance framework of the Yellow token.
            </p>
            
            <div className="card shadow--md padding--lg">
              <div className="card__header">
                <h3>Yellow MiCA Whitepaper</h3>
              </div>
              <div className="card__body">
                <p>
                  Our whitepaper provides a comprehensive overview of the Yellow Network protocol, 
                  tokenomics, and regulatory compliance under MiCA.
                </p>
              </div>
              <div className="card__footer">
                <Link
                  className="button button--primary button--lg"
                  to="/assets/YELLOW_MiCA_White_Paper_v.1.2.pdf"
                  target="_blank"
                  download>
                  Download PDF
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
