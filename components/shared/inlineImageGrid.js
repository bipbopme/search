import chunk from 'lodash/chunk';
import { useState } from 'react';

function getWidth(height, originalHeight, originalWidth) {
  return height * (originalWidth / originalHeight);
}

function GridImage({ image, height = 100 }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={'gridImage ' + (image.height > image.width ? 'portrait' : 'landscape')}
      style={{ height: `${height}px`, width: `${getWidth(height, image.height, image.width)}px` }}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
    >
      <a href={image.url}>
        {hovered && image.hoverSrc ? <img {...image} src={image.hoverSrc} /> : <img {...image} />}
      </a>
    </div>
  );
}

export default function InlineImageGrid({
  images,
  showLead = false,
  rows = 2,
  perRow = 4,
  rowHeight = 100
}) {
  if (!images) return null;
  let count = rows * perRow;

  if (showLead) {
    count += 1;
  }

  const gridImages = images.slice(0, count).map(i => ({
    src: i.thumbnailUrl,
    hoverSrc: i.encodingFormat === 'animatedgif' ? i.proxyContentUrl : null,
    height: i.thumbnail.height,
    width: i.thumbnail.width,
    url: i.contentUrl
  }));

  let leadImage;

  if (showLead) {
    leadImage = gridImages.shift();
  }

  const rowImages = chunk(gridImages, perRow);

  return (
    <div className={`inlineImageGrid ${showLead ? 'showLead' : 'hideLead'}`}>
      {showLead && (
        <div className="lead">
          <GridImage image={leadImage} height={rowHeight * rows + 1} />
        </div>
      )}
      <div className="rows">
        {rowImages.map(row => (
          <div className="row">
            {row.map(p => (
              <GridImage image={p} height={rowHeight} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
