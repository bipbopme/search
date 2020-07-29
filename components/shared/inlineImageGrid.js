import chunk from 'lodash/chunk';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function getWidth(height, originalHeight, originalWidth) {
  return height * (originalWidth / originalHeight);
}

function GridImage({ image, height = 100 }) {
  const [src, setSrc] = useState(image.src);

  useEffect(() => {
    if (image.animatedSrc) {
      const animatedImage = new Image();
      animatedImage.addEventListener('load', () => setSrc(image.animatedSrc), { once: true });
      animatedImage.src = image.animatedSrc;
    }
  }, []);

  function handleImageError() {
    if (image.animatedSrc) {
      setSrc(image.src);
    }
  }

  return (
    <div
      className={'gridImage ' + (image.height > image.width ? 'portrait' : 'landscape')}
      style={{ height: `${height}px`, width: `${getWidth(height, image.height, image.width)}px` }}
    >
      <a href={image.url}>
        <img src={src} height={image.height} width={image.width} onError={handleImageError} />
      </a>
    </div>
  );
}

export default function InlineImageGrid({
  images,
  query,
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
    animatedSrc: i.encodingFormat === 'animatedgif' ? i.proxyContentUrl : null,
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
          <GridImage image={leadImage} height={rowHeight * rows + 2} />
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
      {query && (
        <div className="moreImages">
          <Link href={`/images/search?q=${encodeURIComponent(query)}`}>
            <a>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M20 5H4v14l9.292-9.294a1 1 0 0 1 1.414 0L20 15.01V5zM2 3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993zM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
              </svg>
              More images
            </a>
          </Link>
        </div>
      )}
    </div>
  );
}
