import axios from 'axios';
import { getBaseUrl } from '../lib/utils';
import WebPage from '../components/results/webPage';
import Layout from '../components/layout';
import Header from '../components/header';
import SearchBox from '../components/searchBox';

export default function SearchPage({ q, results }) {
  return (
    <Layout className="searchPage" title={`${q || ''} - bipbop`}>
      <Header>
        <SearchBox query={q} />
      </Header>
      {results && (
        <div className="results">
          <div className="columns">
            <div className="resultsSection main">
              <div className="webPages">
                {results.results.map(webPage => (
                  <WebPage {...webPage} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ req, query }) {
  const response = await axios({
    baseURL: getBaseUrl(req),
    url: '/api/search',
    params: query
  });

  return { props: { results: response.data, q: query.q } };
}
