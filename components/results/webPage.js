export default function webPage({ name, url, displayUrl, snippet }) {
  return (
    <div className="webPage">
      <h4 className="name">
        <a href={url}>{name}</a>
      </h4>
      <div className="displayUrl">{displayUrl}</div>
      <div className="snippet">{snippet}</div>
    </div>
  );
}
