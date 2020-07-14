import geoip from 'geoip-lite';

const MKTS = {
  AR: 'es-AR',
  AU: 'en-AU',
  AT: 'de-AT',
  BE: 'nl-BE',
  BR: 'pt-BR',
  CA: 'en-CA',
  CL: 'es-CL',
  DK: 'da-DK',
  FI: 'fi-FI',
  FR: 'fr-FR',
  DE: 'de-DE',
  HK: 'zh-HK',
  IN: 'en-IN',
  ID: 'en-ID',
  IT: 'it-IT',
  JP: 'ja-JP',
  KR: 'ko-KR',
  MY: 'en-MY',
  MX: 'es-MX',
  NL: 'nl-NL',
  NZ: 'en-NZ',
  NO: 'no-NO',
  CN: 'zh-CN',
  PL: 'pl-PL',
  PH: 'en-PH',
  RU: 'ru-RU',
  ZA: 'en-ZA',
  ES: 'es-ES',
  SE: 'sv-SE',
  CH: 'de-CH',
  TW: 'zh-TW',
  TR: 'tr-TR',
  GB: 'en-GB',
  US: 'en-US'
};

export function getGeo(ip) {
  const geo = geoip.lookup(ip);

  return {
    ...geo,
    market: MKTS[geo.country],
    displayName: `${geo.city}, ${geo.region}`
  };
}
