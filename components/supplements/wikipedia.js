export default function Wikpedia({
  title,
  url,
  summary,
  images,
  infoBox,
  infoBoxPreview,
  source,
  sourceIconUrl
}) {
  return (
    <div className="supplement wikipedia">
      <h3 className="title">{title}</h3>
      <div className="summary">
        {images[0] && <img src={images[0]} />}
        {summary}
      </div>
      <div class="source">
        <a href={url}>
          <img src={sourceIconUrl} width="16" height="16" /> More from {source}
        </a>
      </div>
      {infoBoxPreview && (
        <div className="infoBox" dangerouslySetInnerHTML={{ __html: infoBoxPreview }}></div>
      )}
    </div>
  );
}
