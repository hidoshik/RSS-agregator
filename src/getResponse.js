import axios from 'axios';
import parse from './parser.js';
import createPosts from './createPosts.js';
/* eslint-disable no-param-reassign */
const addProxy = (url) => {
  const proxyURL = new URL('https://allorigins.hexlet.app/get');
  proxyURL.searchParams.append('disableCache', true);
  proxyURL.searchParams.append('url', url);
  return proxyURL;
};

const getResponse = (inputData, state) => {
  const url = addProxy(inputData);
  axios
    .get(url)
    .then((response) => {
      state.loadingProcess.status = 'successfulLoading';
      state.loadingProcess.feedback = 'successfulLoading';
      const parsedData = parse(response.data.contents);
      const { feedContent, postsContent } = parsedData;
      const feed = { id: crypto.randomUUID(), url: inputData, content: feedContent };
      const posts = createPosts(feed.id, postsContent);
      state.feeds.feedsList.unshift(feed);
      state.feeds.postsList.unshift(...posts);
    })
    .catch((error) => {
      state.loadingProcess.status = 'failedLoading';
      if (error.message === 'invalidRSS') {
        state.loadingProcess.feedback = error.message;
      } else if (error.message === 'Network Error') {
        state.loadingProcess.feedback = 'networkError';
      }
    });
};

export default getResponse;
