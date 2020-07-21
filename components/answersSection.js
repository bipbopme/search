import SimpleAnswer from './answers/simple';

export default function ResultsSection({ response: { answers } }) {
  if (!answers || answers.length === 0) return null;

  return (
    <div className="resultsSection top">
      <div className="inner">
        {answers.map(answer => (
          <SimpleAnswer key={answer.id} {...answer} />
        ))}
      </div>
    </div>
  );
}
