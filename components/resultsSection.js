import WebPage from './results/webPage';

export default function ResultsSection({ results }) {
  return (
    <div className="resultsSection main">
      <div className="inner">
        <div className="webPages">
          {results.map(webPage => (
            <WebPage {...webPage} />
          ))}
        </div>
      </div>
    </div>
  );
}
