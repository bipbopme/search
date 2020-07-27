function format(number) {
  return number.toLocaleString(undefined, {
    maximumFractionDigits: 3
  });
}

export default function Stats({ stats }) {
  return (
    <div className="stats">
      About {stats.totalEstimatedMatches.toLocaleString()} results ({format(stats.totalTime / 1000)}{' '}
      seconds)
    </div>
  );
}
