import axios from 'axios';
import { getBaseUrl } from '../lib/utils';
import Layout from '../components/layout';
import Header from '../components/header';
import SearchBox from '../components/searchBox';
import ResultsSection from '../components/resultsSection';
import AnswersSection from '../components/answersSection';
import SupplementsSection from '../components/supplementsSection';

export default function SearchPage({ q, results }) {
  return (
    <Layout className="searchPage" title={`${q || ''} - bipbop`}>
      <Header>
        <SearchBox query={q} />
      </Header>
      {results && (
        <div className="results">
          <AnswersSection answers={results.answers} />
          <div className="columns">
            <SupplementsSection supplements={results.supplements} />
            <ResultsSection results={results.results} />
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
