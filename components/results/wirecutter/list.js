import WirecutterItem from './item';

export default function WirecutterList({
  title,
  recommendations,
  source,
  sourceIconUrl,
  sourceUrl
}) {
  return (
    <section className="wirecutterList">
      <h3 className="sectionTitle">{title || `Recommended by ${source}`}</h3>
      <div className="source">
        <a href={sourceUrl}>
          <img src={sourceIconUrl} width="16" height="16" /> More from {source}
        </a>
      </div>
      <div className="wirecutterItems cards">
        {recommendations.slice(0, 3).map(item => (
          <WirecutterItem {...item} source={source} sourceUrl={sourceUrl} />
        ))}
      </div>
    </section>
  );
}
