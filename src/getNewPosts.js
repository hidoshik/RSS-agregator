import axios from 'axios';
import parse from './parser.js';
import addProxy from './addProxy.js';
import createPosts from './createPosts.js';

const getNewPosts = (state) => {
  const { feedsList, postsList } = state.feeds;

  const promises = feedsList.map((feed) => {
    const feedURL = addProxy(feed.url);
    return axios.get(feedURL).then((response) => {
      const parsedData = parse(response.data.contents);
      const { postsContent } = parsedData;
      const addedPostsLinks = postsList.map((post) => post.content.link);
      const newPostsContent = postsContent.filter(({ link }) => !addedPostsLinks.includes(link));

      if (newPostsContent.length !== 0) {
        const newPosts = createPosts(feed.id, newPostsContent);
        state.feeds.postsList.unshift(...newPosts);
      }
      return state;
    });
  });

  Promise.all(promises).finally(() => {
    setTimeout(() => {
      getNewPosts(state);
    }, 5000);
  });
};

export default getNewPosts;
