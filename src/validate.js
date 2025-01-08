import * as yup from 'yup';

export default (url, urls) => {
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
