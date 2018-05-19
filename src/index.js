import { getAlbums, getPosts, getComments, getUsers } from './api';
import { joinPostWithComments, joinUserWithAlbums, joinPostWithUser } from './utils';

/* Takes the posts from typicode's JSON placeholder that come in the form of
 * {
 *   body,
 *   id,
 *   title,
 *   userId,
 * }
 * and transforms it into
 * {
 *   body,
 *   comments: [{
 *     body,
 *     email,
 *     id (normalized to start at 0 for each post),
 *     name,
 *   }]
 *   id,
 *   title,
 *   user: {
 *     address: {...},
 *     albums: [{
 *       id (normalized to start at 0 for each user),
 *       title
 *     }],
 *     company: {...},
 *     id,
 *     name,
 *     phone,
 *     username,
 *     website,
 *   }
 * }
 */

const removePostId = comment => {
  const { postId, ...commentWithoutPostId } = comment;
  return commentWithoutPostId;
};

const removeUserId = album => {
  const { userId, ...albumWithoutUserId } = album;
  return albumWithoutUserId;
};

const resetIds = (item, i) => ({ ...item, id: i });

const ramdaTransform = (albums, comments, posts, users) => {
  const postsWithComments = posts.map(joinPostWithComments(comments));
  const usersWithAlbums = users.map(joinUserWithAlbums(albums));
  const postsWithCommentsAndUsers = postsWithComments.map(joinPostWithUser(usersWithAlbums));
  return postsWithCommentsAndUsers;
};

const nativeTransform = (albums, comments, posts, users) => {
  const postsWithComments = posts.map(post => ({
    ...post,
    comments: comments
      .filter(c => c.postId === post.id)
      .map(resetIds)
      .map(removePostId)
  }));
  const usersWithAlbums = users.map(user => ({
    ...user,
    albums: albums
      .filter(a => a.userId === user.id)
      .map(resetIds)
      .map(removeUserId)
  }));
  const postsWithCommentsAndUsers = postsWithComments.map(post => {
    const {userId, ...postWithoutUserId} = post;
    return {
      ...postWithoutUserId,
      user: usersWithAlbums.find(u => u.id === post.id)
    };
  });
  return postsWithCommentsAndUsers;
};

(async () => {
  const [albums, comments, posts, users] =
    await Promise.all([getAlbums(), getComments(), getPosts(), getUsers()]);

  console.time('Ramda transform');
  const ramdaResult = ramdaTransform(albums, comments, posts, users);
  console.timeEnd('Ramda transform');

  console.time('Native transform');
  const nativeResult = nativeTransform(albums, comments, posts, users);
  console.timeEnd('Native transform');

  console.log('nativeResult', nativeResult);
  console.log('ramdaResult', ramdaResult);
})();
