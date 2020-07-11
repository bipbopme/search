export default function VideoItem({ title, url, duration, thumbUrl, date, views, source }) {
  return (
    <div className="videoItem card">
      <div className="thumbnail">
        <img src={thumbUrl} />
      </div>
      <div className="info">
        <h4 className="name">
          <a href={url}>{title}</a>
        </h4>
        {views && <div className="views">{views}</div>}
        <div className="source">{source}</div>
      </div>
    </div>
  );
}
