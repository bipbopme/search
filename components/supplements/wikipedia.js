export default function Wikpedia({ title, url, summary, images, infoBox }) {
  return (
    <div className="supplement wikipedia">
      <h3 className="title">{title}</h3>
      <div className="summary">
        {!!images?.length && <img src={images[0]} />}
        {summary}
      </div>
      <div className="infoBox" dangerouslySetInnerHTML={{ __html: infoBox }}></div>
    </div>
  );
}
