import Head from 'next/head';

function Layout({ title, className, children }) {
  return (
    <div className={className}>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </div>
  );
}

export default Layout;
