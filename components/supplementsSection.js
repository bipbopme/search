import Wikipedia from './supplements/wikipedia';
import PlacesSupplement from './supplements/places';

function renderResultComponent(supplement) {
  let renderedSupplement;

  switch (supplement.type) {
    case 'wikipedia':
      renderedSupplement = <Wikipedia key={supplement.id} {...supplement} />;
      break;
    case 'places':
      renderedSupplement = <PlacesSupplement key={supplement.id} {...supplement} />;
      break;
    default:
      renderedSupplement = <h3 className="warning">Marv, you forgot about {supplement.type}!</h3>;
  }

  return renderedSupplement;
}

export default function ResultsSection({ response: { supplements } }) {
  if (!supplements || supplements.length === 0) return null;

  return (
    <div className="resultsSection supplements">
      {supplements.map(supplement => renderResultComponent(supplement))}
    </div>
  );
}
