import { useState } from 'react';

export default function webPage({ name, url, displayUrl, snippet, deepLinks, isNavigational }) {
  const { host } = new URL(url);
  const [faviconSrc, setFaviconSrc] = useState(`https://${host}/favicon.ico`);

  function handleImageError() {
    setFaviconSrc('/images/icons/checkbox-circle-line.svg');
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
      <div className="displayUrl">{displayUrl}</div>
      <div className="snippet">{snippet}</div>
      {isNavigational && deepLinks && (
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
