import axios from 'axios';
import { getBaseUrl } from '../lib/utils';
import Layout from '../components/layout';
import Header from '../components/header';
import SearchBox from '../components/searchBox';
import ResultsSection from '../components/resultsSection';
import AnswersSection from '../components/answersSection';
import SupplementsSection from '../components/supplementsSection';
import SpellCheck from '../components/spellCheck';

export default function SearchPage({ q, response }) {
  return (
    <Layout className="searchPage" title={`${q || ''} - bipbop`}>
      <Header>
        <SearchBox query={q} />
      </Header>
      {response && (
        <div className="results">
          <div className="info">
            <div className="stats">
              About {response.totalEstimatedMatches.toLocaleString()} results
            </div>
          </div>
          <AnswersSection response={response} />
          <div className="columns">
            <SupplementsSection response={response} />
            <ResultsSection response={response} />
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

  return { props: { response: response.data, q: query.q } };
}
