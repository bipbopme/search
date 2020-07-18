import WebPage from './results/webPage/item';
import VideoList from './results/video/list';
import PlaceList from './results/place/list';
import SpellCheck from './spellCheck';
import dynamic from 'next/dynamic';

const WeatherItem = dynamic(import('./results/weather/item'));

function renderResultComponent(item) {
  let renderedResult;

  switch (item.type) {
    case 'webPage':
      renderedResult = <WebPage {...item} />;
      break;
    case 'videos':
      renderedResult = <VideoList {...item} />;
      break;
    case 'places':
      renderedResult = <PlaceList {...item} />;
      break;
    case 'weather':
      renderedResult = <WeatherItem {...item} />;
      break;
    default:
      renderedResult = <h3 className="warning">Marv, you forgot about {item.type}!</h3>;
  }

  return renderedResult;
}

export default function ResultsSection({ response }) {
  return (
    <div className="resultsSection main">
      <SpellCheck queryContext={response.queryContext} />
      <div className="inner">{response.results.map(item => renderResultComponent(item))}</div>
    </div>
  );
}
