const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

function getStaticImage(overlays, width = 628, height = 200) {
  const baseUrl = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static';
  const pins = overlays
    .map(o => `pin-s-${o.marker.label}(${o.marker.coordinates.join(',')})`)
    .join(',');
  const position = 'auto';
  const dimensions = `${width}x${height}@2x`;
  const params = new URLSearchParams();

  params.append('logo', 'false');
  params.append('access_token', MAPBOX_TOKEN);

  return `${baseUrl}/${pins}/${position}/${dimensions}?${params}`;
}

function PlaceListMap({ places, width, height }) {
  const overlays = places
    .map((p, i) => {
      const { latitude, longitude } = p.coordinates;

      return {
        marker: {
          coordinates: [longitude, latitude],
          label: (i + 1).toString()
        }
      };
    })
    // Makes #1 the top layer
    .reverse();

  const url = getStaticImage(overlays, width, height);

  return (
    <div className="placeListMap">
      <img src={url} width="628" height="200" />
    </div>
  );
}

export default PlaceListMap;
