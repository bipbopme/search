import { useState } from 'react';
import InlineImageGrid from '../shared/inlineImageGrid';

function truncate(text, length = 350) {
  if (text.length > length) {
    return text.substring(0, length).replace(/[\.\s]+$/, '') + '…';
  } else {
    return text;
  }
}

export default function Wikpedia({
  title,
  url,
  summary,
  images,
  infoBox,
  infoBoxPreview,
  source,
  sourceIconUrl,
  relatedImages
}) {
  const [collapsed, setCollapsed] = useState(true);

  function toggleCollapsed() {
    setCollapsed(!collapsed);
  }

  return (
    <div className="supplement wikipedia">
      <InlineImageGrid images={relatedImages} showLead={true} perRow={2} />
      <div className="content">
        <h3 className="title">{title}</h3>
        <div className="summary">
          {!relatedImages && images[0] && <img src={images[0]} />}
          {collapsed ? truncate(summary) : summary}
        </div>
        <div className="source">
          <a href={url}>
            <img src={sourceIconUrl} width="16" height="16" /> More from {source}
          </a>
        </div>
        {infoBoxPreview && (
          <div
            className="infoBox"
            dangerouslySetInnerHTML={{ __html: collapsed ? infoBoxPreview : infoBox }}
          ></div>
        )}
      </div>
      {collapsed && (
        <footer className="more">
          <a onClick={toggleCollapsed}>
            <img className="icon" src="/images/icons/line-height.svg" height="16" width="16" /> Show
            more
          </a>
        </footer>
      )}
    </div>
  );
}
