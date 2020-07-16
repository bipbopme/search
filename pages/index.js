import Layout from '../components/layout';
import Header from '../components/header';
import SearchBox from '../components/searchBox';

export default function IndexPage() {
  return (
    <Layout className="indexPage" title="bipbop">
      <Header>
        <SearchBox placeholder="Search the web" />
        <div className="snippet">
          <div>
            Looking for free and easy video chat? Checkout{' '}
            <a href="https://meet.bipbop.me/">bipbop meet</a>!
          </div>
        </div>
      </Header>
    </Layout>
  );
}
