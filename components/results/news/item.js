import { DateTime } from 'luxon';

export default function NewsItem({ title, url, imageUrl, source, firstSeenAt }) {
  // TODO: Dates aren't being handled correctly in the crawler
  const relativeTimeStamp = DateTime.fromISO(firstSeenAt, {
    zone: 'utc'
  }).toRelative();

  return (
    <div className="newsItem card">
      <div className="thumbnail" style={{ backgroundImage: `url(${imageUrl})` }}></div>
      <div className="info">
        <h4 className="name">
          <a href={url}>{title}</a>
        </h4>
      </div>
      <div className="footer">
        <div className="date">{relativeTimeStamp}</div>
        <div className="source">{source.name}</div>
      </div>
    </div>
  );
}
