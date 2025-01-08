import * as yup from 'yup';

yup.setLocale({
  mixed: {
    notOneOf: () => ({ key: 'duplicatedUrl' }),
    required: () => ({ key: 'emptyInput' }),
  },
  string: {
    url: () => ({ key: 'invalidUrl' }),
  },
});
