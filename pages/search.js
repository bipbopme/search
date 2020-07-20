import axios from 'axios';
import Layout from '../components/layout';
import Header from '../components/header';
import SearchBox from '../components/searchBox';
import ResultsSection from '../components/resultsSection';
import AnswersSection from '../components/answersSection';
import Stats from '../components/stats';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const fetcher = (url, q) => axios.get(url, { params: { q } }).then(res => res.data);

export default function SearchPage() {
  const router = useRouter();
  let { q } = router.query;
  const { data: response } = useSWR(q ? ['/api/search', q] : null, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false
  });

  return (
    <Layout className="searchPage" title={`${q || ''} - bipbop`}>
      <Header>
        <SearchBox query={q} />
      </Header>
      {response && (
        <div className="results">
          <Stats stats={response.stats} />
          <AnswersSection response={response} />
          <ResultsSection response={response} />
        </div>
      )}
    </Layout>
  );
}
