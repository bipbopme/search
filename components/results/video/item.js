export default function VideoItem({ title, url, duration, thumbUrl, views, source }) {
  return (
    <div className="videoItem card">
      <div className="thumbnail" style={{ backgroundImage: `url(${thumbUrl})` }}>
        <div className="label duration">{duration}</div>
      </div>
      <div className="info">
        <h4 className="name">
          <a href={url}>{title}</a>
        </h4>
      </div>
      <div className="footer">
        {views && views > 0 ? <div className="views">{views.toLocaleString()} views</div> : null}
        <div className="source">{source}</div>
      </div>
    </div>
  );
}
