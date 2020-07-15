import Head from 'next/head';

function Layout({ title, className, children }) {
  return (
    <div className={className}>
      <Head>
        <title>{title}</title>
        <link
          rel="search"
          title="bipbop"
          type="application/opensearchdescription+xml"
          href="/api/opensearch"
        />
      </Head>
      {children}
    </div>
  );
}

export default Layout;
