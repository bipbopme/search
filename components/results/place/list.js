import PlaceItem from './item';
import PlaceListMap from './listMap';

export default function PlaceList({
  places,
  source,
  sourceUrl,
  sourceIconUrl,
  mapWidth,
  mapHeight
}) {
  const slicedPlaces = places.slice(0, 4);

  return (
    <section className="placeList">
      <PlaceListMap places={slicedPlaces} width={mapWidth} height={mapHeight} />
      <div className="placeItems">
        {slicedPlaces.map((item, i) => (
          <PlaceItem key={item.id} {...item} position={i + 1} />
        ))}
      </div>
      <footer class="more">
        <a href={sourceUrl}>
          <img className="icon" src={sourceIconUrl} height="16" width="16" /> More from {source}
        </a>
      </footer>
    </section>
  );
}
