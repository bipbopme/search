import chunk from 'lodash/chunk';

function getWidth(height, originalHeight, originalWidth) {
  return height * (originalWidth / originalHeight);
}

function GridImage({ image, height = 100 }) {
  return (
    <div
      className="gridImage"
      style={{ height: `${height}px`, width: `${getWidth(height, image.height, image.width)}px` }}
    >
      <img {...image} />
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
    height: i.thumbnail.height,
    width: i.thumbnail.width
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
