import InlineImageGrid from '../../shared/inlineImageGrid';

export default function ImageList({ query, response }) {
  return (
    <div className="imageList">
      <h3 className="sectionTitle">Images</h3>
      <InlineImageGrid images={response.results} rows={2} query={query} rowHeight={150} />
    </div>
  );
}
