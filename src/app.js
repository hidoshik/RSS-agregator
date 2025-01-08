/* eslint-disable no-param-reassign */
import 'bootstrap';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import * as yup from 'yup';
import parse from './parser.js';
import resources from './locales/ru.js';
import localeSettings from './locales/localeSettings.js';
import { initialRender, render } from './view.js';
import updateTime from './updateTime.js';

const validate = (url, urls) => {
  const schema = yup.string().url().notOneOf(urls).required();
  return schema
    .validate(url)
    .then(() => null)
    .catch((error) => {
      console.log(error.errors);
      const errorLocale = error.errors.map((err) => err.key);
      return errorLocale;
    });
};

yup.setLocale(localeSettings);

const createPosts = (feedID, postsContent) => {
  const posts = postsContent.map((content) => {
    const post = { id: crypto.randomUUID(), feedID, content };
    return post;
  });
  return posts;
};

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
    }, updateTime);
  });
};

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance
    .init({
      lng: 'ru',
      debug: false,
      resources,
    })
    .then(() => {
      const initialState = {
        form: {
          valid: true,
          feedback: '',
        },
        loadingProcess: {
          status: '',
          feedback: '',
        },
        feeds: {
          feedsList: [],
          postsList: [],
        },
        uiState: {
          seenPosts: [],
          modalID: '',
        },
      };

      const elements = {
        form: document.querySelector('.rss-form'),
        input: document.getElementById('url-input'),
        feedbackElement: document.querySelector('.feedback'),
        feedsContainer: document.querySelector('.feeds'),
        postsContainer: document.querySelector('.posts'),
        initialTextElements: {
          title: document.querySelector('title'),
          modalRedirectButton: document.querySelector('.full-article'),
          modalCloseButton: document.querySelector('.modal-footer > [data-bs-dismiss="modal"]'),
          mainHeader: document.querySelector('h1'),
          labelForInput: document.querySelector('label[for="url-input"]'),
          submitButton: document.querySelector('button[type="submit"]'),
          mainDescription: document.querySelector('.lead'),
          exampleInput: document.querySelector('.text-muted'),
          creatorInformation: document.querySelector('.text-center').firstChild,
        },
      };

      initialRender(elements.initialTextElements, i18nextInstance);

      const watchedState = onChange(initialState, render(elements, initialState, i18nextInstance));

      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();

        const data = new FormData(event.target);
        const inputData = data.get('url');
        const addedFeeds = watchedState.feeds.feedsList.map((feed) => feed.url);
        validate(inputData, addedFeeds).then((feedback) => {
          if (feedback) {
            watchedState.form.valid = false;
            watchedState.form.feedback = feedback;
          } else {
            watchedState.form.valid = true;
            watchedState.loadingProcess.status = 'loading';

            watchedState.form.feedback = '';
            watchedState.loadingProcess.feedback = '';

            getResponse(inputData, watchedState);
          }
        });
      });
      elements.postsContainer.addEventListener('click', (event) => {
        const { target } = event;

        if (target.tagName === 'A') {
          watchedState.uiState.seenPosts.push(target.dataset.id);
        }
        if (target.tagName === 'BUTTON') {
          watchedState.uiState.seenPosts.push(target.dataset.id);
          watchedState.uiState.modalID = target.dataset.id;
        }
      });

      getNewPosts(watchedState);
    });
};
