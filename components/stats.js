function format(number) {
  return number.toLocaleString(undefined, {
    maximumFractionDigits: 3
  });
}

export default function Stats({ stats, query }) {
  return (
    <div className="stats" title={`${format(stats.totalTime / 1000)} seconds`}>
      About {stats.totalEstimatedMatches.toLocaleString()} results for <strong>{query}</strong>
    </div>
  );
}
