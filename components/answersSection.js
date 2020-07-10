import SimpleAnswer from './answers/simple';

export default function ResultsSection({ answers }) {
  if (!answers || answers.length === 0) return null;

  return (
    <div className="resultsSection top">
      <div className="inner">
        {answers.map(answer => (
          <SimpleAnswer {...answer} />
        ))}
      </div>
    </div>
  );
}
