import axios from 'axios';
import cheerio from 'cheerio';
import { urlJoin, convertToNumber } from '../../utils';
import { memoize } from '../../redis';

async function searchYouTubeVideos(query) {
  const response = await axios.get('https://www.youtube.com/results', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    },
    params: {
      search_query: query
    }
  });

  const $ = cheerio.load(response.data);
  const videos = [];

  $('#results .yt-lockup-video').each((i, el) => {
    const $video = $(el);
    const baseUrl = 'https://www.youtube.com/';

    videos.push({
      title: $video.find('.yt-lockup-title a').text(),
      url: urlJoin(baseUrl, $video.find('.yt-lockup-title a').attr('href')),
      duration: $video.find('.video-time').text(),
      thumbUrl: urlJoin(baseUrl, $video.find('.yt-thumb-simple img').attr('src')),
      date: $video.find('.yt-lockup-meta-info li:first-child').text(),
      views: convertToNumber($video.find('.yt-lockup-meta-info li:last-child').text()),
      source: 'YouTube'
    });
  });

  return videos;
}

const searchYouTubeVideosCached = memoize(searchYouTubeVideos);

async function handleResultMatch({ query, index }) {
  const videos = await searchYouTubeVideosCached(query);

  if (videos.length) {
    return {
      result: {
        insertIndex: Math.max(0, index - 1),
        type: 'videos',
        videos: videos.slice(0, 3)
      }
    };
  }
}

export default {
  name: 'Videos (Result)',
  description: 'Displays inline video search results.',
  matches: [
    {
      result: {
        urlPattern: /youtube.com|vimeo.com/,
        maxIndex: 9,
        onMatch: handleResultMatch
      }
    }
  ],
  shouldMatchQueries: ['double rainbow video'],
  shouldNotMatchQueries: ['']
};
