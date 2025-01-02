const renderFormFeedback = (elements, state, i18nextInstance) => {
  const { feedbackElement } = elements;
  const { input } = elements;
  if (state.form.valid) {
    input.classList.remove('is-invalid');
    feedbackElement.classList.remove('text-danger');
    feedbackElement.classList.add('text-success');
  } else {
    input.classList.add('is-invalid');
    feedbackElement.classList.add('text-danger');
  }
};

const render = (elements, state, i18nextInstance) => (path, value) => {
  switch (path) {
    case 'form.valid':
      renderFormValid(elements, value, state, i18nextInstance);
      break;
    case 'form.feedback':
      renderFormFeedback(elements, value, state, i18nextInstance);
      break;
    case 'loadingProcess.feedback':
      renderLoadingFeedback(elements, value, state, i18nextInstance);
      break;
    case 'loadingProcess.status':
      renderSubmitButton(elements, value);
      break;
    case 'feeds.feedsList':
      renderFeedsList(elements, state, i18nextInstance);
      break;
    case 'feeds.postsList':
      renderPosts(elements, state, i18nextInstance);
      break;
    default:
      break;
  }
};

export { render };
