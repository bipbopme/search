export default function SimpleAnswer({ title, subtitle, source, sourceUrl, sourceIconUrl }) {
  return (
    <div className="answer simpleAnswer">
      <h3 className="title">{title}</h3>
      <div className="subtitle">{subtitle}</div>
      <div className="source">
        {sourceUrl && (
          <a href={sourceUrl}>
            <img src={sourceIconUrl} width="16" height="16" /> More from {source}
          </a>
        )}
        {!sourceUrl && source && (
          <>
            <img src={sourceIconUrl} width="16" height="16" /> {source}
          </>
        )}
      </div>
    </div>
  );
}
