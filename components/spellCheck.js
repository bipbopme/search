import Link from 'next/link';

function getSearchUrl(query) {
  const params = new URLSearchParams();
  params.set('q', query);

  return '/search?' + params.toString();
}

export default function SpellCheck({
  queryContext: { originalQuery, alteredQuery, alterationDisplayQuery, alterationOverrideQuery }
}) {
  if (!alteredQuery) {
    return null;
  }

  return (
    <div className="spellCheck">
      <h2>
        Showing results for{' '}
        <Link href={getSearchUrl(alterationDisplayQuery)}>
          <a>{alteredQuery}</a>
        </Link>
      </h2>
      <h3>
        Search instead for{' '}
        <Link href={getSearchUrl(alterationOverrideQuery)}>
          <a>{originalQuery}</a>
        </Link>
      </h3>
    </div>
  );
}
