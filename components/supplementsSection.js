import Wikipedia from './supplements/wikipedia';

export default function ResultsSection({ supplements }) {
  if (!supplements || supplements.length === 0) return null;

  return (
    <div className="resultsSection sidebar">
      <div className="inner">
        {supplements.map(supplement => (
          <Wikipedia {...supplement} />
        ))}
      </div>
    </div>
  );
}
