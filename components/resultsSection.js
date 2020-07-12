import WebPage from './results/webPage/item';
import VideoList from './results/video/list';

function renderResultComponent(item) {
  let renderedResult;

  switch (item.type) {
    case 'webPage':
      renderedResult = <WebPage {...item} />;
      break;
    case 'videos':
      renderedResult = <VideoList {...item} />;
      break;
    default:
      renderedResult = <h3 className="warning">Marv, you forgot about {item.type}!</h3>;
  }

  return renderedResult;
}

export default function ResultsSection({ results }) {
  return (
    <div className="resultsSection main">
      <div className="inner">
        <div className="webPages">{results.map(item => renderResultComponent(item))}</div>
      </div>
    </div>
  );
}
