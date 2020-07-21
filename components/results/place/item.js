export default function PlaceItem({
  name,
  url,
  image_url,
  rating,
  review_count,
  price,
  categories,
  location,
  display_phone,
  position
}) {
  function navigateToUrl() {
    window.location = url;
  }

  function resizeImageUrl(imageUrl, size = 'ls') {
    return imageUrl.replace(/o.jpg$/, `${size}.jpg`);
  }

  return (
    <div className="placeItem" onClick={navigateToUrl}>
      {image_url && (
        <div className="image">
          <img src={resizeImageUrl(image_url)} />
        </div>
      )}
      <h3 className="name">
        {position}. <a href={url}>{name}</a>
      </h3>
      <div className="rating">
        <span
          className={`stars rating-${rating.toString().replace('.', '-')}`}
          title={`${rating} stars`}
        ></span>{' '}
        ({review_count})
      </div>
      <div className="info">
        {price && `${price}  · `}
        {categories.map(c => c.title).join(', ')}
      </div>
      <div className="contact">
        {location.address1 && `${location.address1},`} {location.city}
      </div>
    </div>
  );
}
