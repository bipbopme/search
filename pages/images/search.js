import axios from 'axios';
import Layout from '../../components/layout';
import Header from '../../components/header';
import SearchBox from '../../components/searchBox';
import Stats from '../../components/stats';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Gallery from 'react-photo-gallery';
import Navigation from '../../components/navigation';

const fetcher = (url, q) => axios.get(url, { params: { q } }).then(res => res.data);

function ResultImage({ photo, margin }) {
  const result = photo.result;
  const host = new URL(result.hostPageUrl).host.replace(/^www./, '');

  return (
    <div className="imageResultsItem" style={{ margin: margin, width: photo.width }}>
      <a
        className="image"
        href={result.contentUrl}
        style={{
          backgroundImage: `url(${result.thumbnailUrl})`,
          height: photo.height,
          width: photo.width
        }}
      ></a>
      <h4 className="name" title={result.name}>
        <a href={result.hostPageUrl}>{result.name}</a>
      </h4>
      <div className="host">
        <a href={result.hostPageUrl}>{host}</a>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const router = useRouter();
  let { q } = router.query;
  let images;
  const { data: response } = useSWR(q ? ['/api/images/search', q] : null, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false
  });

  if (response) {
    images = response.results.map(result => ({
      height: result.thumbnail.height,
      width: result.thumbnail.width,
      result
    }));
  }

  return (
    <Layout className="imageSearchPage" title={`${q || ''} - bipbop`}>
      <Header>
        <SearchBox query={q} path="/images/search" />
        <Navigation query={q} selected="images" />
      </Header>
      {response && (
        <div className="results">
          {images && (
            <div className="imageResults">
              <Gallery photos={images} targetRowHeight={180} margin={4} renderImage={ResultImage} />
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
