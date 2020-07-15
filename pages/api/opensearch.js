import { getBaseUrl } from '../../lib/utils';

export default async (req, res) => {
  const baseUrl = getBaseUrl(req);

  const response = `<?xml version="1.0" encoding="utf-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>bipbop</ShortName>
  <Description>Search bipbop</Description>
  <Url type="text/html" template="${baseUrl}/search?q={searchTerms}" />
  <Url type="application/x-suggestions+json" template="${baseUrl}/api/suggestions?q={searchTerms}" />
</OpenSearchDescription>`;

  res.setHeader('Content-Type', 'application/opensearchdescription+xml');
  res.status(200).end(response);
};
