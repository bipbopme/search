export default function WirecutterItem({
  label,
  title,
  url,
  imageUrl,
  summary,
  description,
  source,
  sourceUrl
}) {
  return (
    <div className="wirecutterItem card">
      <div className="info">
        <div className="label">{label.replace('Our', 'Top')}</div>
        <a href={url}>
          <img src={imageUrl} />
        </a>
        <h4 className="name" title={title}>
          <a href={url}>{title}</a>
        </h4>
        <h5 className="summary" title={summary}>
          {summary}
        </h5>
        <div className="description">{description}</div>
        <div className="buyingOptions"></div>
      </div>
      <div className="footer">
        <div className="source">
          <a href={sourceUrl}>{source}</a>
        </div>
      </div>
    </div>
  );
}
