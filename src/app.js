import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import { render } from './view.js';

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
  }

  const form = document.querySelector('.rss-form');
  const input = document.getElementById('url-input');

  const watchedState = onChange(initialState, render(input, initialState, i18nextInstance));

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(event.target);
    const inputData = data.get('url');
    const addedFeeds = watchedState.feeds.feedsList.map((feed) => feed.url);
    validate(inputData, addedFeeds)
      .then(feedback => {
        if (feedback) {
          watchedState.form.valid = false;
          watchedState.form.feedback = feedback;
        } else {
          watchedState.form.valid = true;
          watchedState.loadingProcess.status = 'loading';

          watchedState.form.feedback = '';
          watchedState.loadingProcess.feedback = '';
        }

      })

  })  
};
