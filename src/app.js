import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from '../node_modules/i18next/index.js';
import resources from './locales/ru.js';
import { initialRender, render } from './view.js';

const validate = (url, urls) => {
  const schema = yup.string().url().notOneOf(urls).required();
  return schema
    .validate(url)
    .then(() => null)
    .catch((error) => {
      const errorLocale = error.errors.map((err) => err.key).join('');
      return errorLocale;
    });
};

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  yup.setLocale({
    mixed: {
      notOneOf: () => ({ key: 'duplicatedUrl' }),
      required: () => ({ key: 'emptyInput' }),
    },
    string: {
      url: ({ url }) => ({ key: 'invalidUrl', values: { url } }),
    },
  });

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
      }
    });
  });
};
