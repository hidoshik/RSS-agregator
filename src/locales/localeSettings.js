export default {
  mixed: {
    notOneOf: () => ({ key: 'duplicatedUrl' }),
    required: () => ({ key: 'emptyInput' }),
  },
  string: {
    url: () => ({ key: 'invalidUrl' }),
  },
};
