import NewsItem from './item';

export default function NewsList({ articles }) {
  return (
    <section className="newsList">
      <h3 className="sectionTitle">Top stories</h3>
      <div className="newsItems cards">
        {articles.map(item => (
          <NewsItem {...item} />
        ))}
      </div>
    </section>
  );
}
