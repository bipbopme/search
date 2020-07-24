import InlineImageGrid from '../../shared/inlineImageGrid';

export default function ImageList({ response }) {
  return (
    <div className="imageList">
      <h3 className="sectionTitle">Images</h3>
      <InlineImageGrid images={response.results} rows={3} />
    </div>
  );
}
