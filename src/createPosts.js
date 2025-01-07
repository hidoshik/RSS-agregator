export default (feedID, postsContent) => {
  const posts = postsContent.map((content) => {
    const post = { id: crypto.randomUUID(), feedID, content };
    return post;
  });
  return posts;
};
