/* eslint-disable no-param-reassign */
import _ from 'lodash';
import getData from './parser.js';
import fetchData from './fetch.js';

const updatePosts = (watchedState) => {
  const { feeds, posts } = watchedState;
  const promises = feeds.map(({ url, id }) => fetchData(url)
    .then(({ data }) => {
      const [, receivedPosts] = getData(data.contents);
      const oldPosts = posts.filter((post) => post.feedId === id);
      const addedPosts = _.differenceBy(receivedPosts, oldPosts, 'link');
      if (addedPosts.length !== 0) {
        const newPosts = addedPosts.map((post) => ({ ...post, id: _.uniqueId(), feedId: id }));
        watchedState.posts = [...newPosts, ...posts];
      }
    })
    .catch(console.error));
  Promise.all(promises)
    .finally(() => setTimeout(() => updatePosts(watchedState), 5000));
};
export default updatePosts;
