import SupplementsSection from './supplementsSection';
import WebPage from './results/webPage/item';
import VideoList from './results/video/list';
import PlaceList from './results/place/list';
import SpellCheck from './spellCheck';
import ImageList from './results/image/list';
import WirecutterList from './results/wirecutter/list';
import dynamic from 'next/dynamic';

const WeatherItem = dynamic(import('./results/weather/item'));

function renderResultComponent(item) {
  let renderedResult;

  switch (item.type) {
    case 'webPage':
      renderedResult = <WebPage key={item.id} {...item} />;
      break;
    case 'videos':
      renderedResult = <VideoList key={item.id} {...item} />;
      break;
    case 'places':
      renderedResult = <PlaceList key={item.id} {...item} />;
      break;
    case 'weather':
      renderedResult = <WeatherItem key={item.id} {...item} />;
      break;
    case 'images':
      renderedResult = <ImageList key={item.id} {...item} />;
      break;
    case 'wirecutter':
      renderedResult = <WirecutterList key={item.id} {...item} />;
      break;
    default:
      renderedResult = <h3 className="warning">Marv, you forgot about {item.type}!</h3>;
  }

  return renderedResult;
}

export default function ResultsSection({ response }) {
  let navigationalResult;

  if (response.results[0]?.isNavigational) {
    navigationalResult = response.results.shift();
  }

  return (
    <div className="resultsSection main">
      <div className="resultsGroup">
        <SpellCheck queryContext={response.queryContext} />
        {navigationalResult && renderResultComponent(navigationalResult)}
      </div>
      <SupplementsSection response={response} />
      <div className="resultsGroup">
        {response.results.map(item => renderResultComponent(item))}
      </div>
    </div>
  );
}
