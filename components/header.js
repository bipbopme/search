import Link from 'next/link';

export default function Header({ children }) {
  return (
    <header>
      <h1>
        <Link href="/">
          <a>bipbop</a>
        </Link>
      </h1>
      {children}
    </header>
  );
}
