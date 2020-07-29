import Link from 'next/link';

export default function Navigation({ query, selected }) {
  function getSearchUrl(path) {
    return `${path}?q=${encodeURIComponent(query)}`;
  }

  function getClassName(navName) {
    return selected === navName ? 'selected' : null;
  }

  return (
    <nav className="navigation">
      <ul>
        <li className={getClassName('all')}>
          <Link href={getSearchUrl('/search')}>
            <a>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" />
                </svg>
                All
              </span>
            </a>
          </Link>
        </li>
        <li className={getClassName('images')}>
          <Link href={getSearchUrl('/images/search')}>
            <a>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M4.828 21l-.02.02-.021-.02H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H4.828zM20 15V5H4v14L14 9l6 6zm0 2.828l-6-6L6.828 19H20v-1.172zM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                </svg>
                Images
              </span>
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
