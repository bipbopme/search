import { useState } from 'react';

export default function webPage({ name, url, displayUrl, snippet, deepLinks, isNavigational }) {
  const { origin } = new URL(url);
  const [faviconSrc, setFaviconSrc] = useState(
    `/api/images/favicon?url=${encodeURIComponent(origin)}`
  );

  function handleImageError() {
    setFaviconSrc('/images/icons/checkbox-circle-line.svg');
  }

  function getShortDisplayUrl() {
    return displayUrl.replace(/^https?:\/\/(www[^\.]*\.)?/, '');
  }

  return (
    <div className={`webPage ${isNavigational ? 'isNavigational' : 'notNavigational'}`}>
      <h4 className="name">
        <a href={url}>
          {isNavigational && (
            <img
              className="logo"
              src={faviconSrc}
              height="16"
              width="16"
              onError={handleImageError}
            />
          )}
          {name}
        </a>
      </h4>
      <div className="displayUrl">
        <a href={url} title={displayUrl}>
          {getShortDisplayUrl()}
        </a>
      </div>
      <div className="snippet">{snippet}</div>
      {isNavigational && deepLinks && deepLinks.length >= 2 && (
        <div className="deepLinks">
          {deepLinks.map(deepLink => (
            <div className="deepLink">
              <div className="name">
                <a href={deepLink.url}>{deepLink.name}</a>
              </div>
              <div className="snippet">{deepLink.snippet}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
