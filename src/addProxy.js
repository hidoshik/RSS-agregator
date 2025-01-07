const addProxy = (url) => {
  const proxyURL = new URL('https://allorigins.hexlet.app/get');
  proxyURL.searchParams.append('disableCache', true);
  proxyURL.searchParams.append('url', url);
  return proxyURL;
};

export default addProxy;
