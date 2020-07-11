import VideoItem from './item';

export default function VideoList({ videos }) {
  return (
    <section className="videoList">
      <h3 className="sectionTitle">Videos</h3>
      <div className="videoItems cards">
        {videos.map(item => (
          <VideoItem {...item} />
        ))}
      </div>
    </section>
  );
}
