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
(async () => {
  const [albums, comments, posts, users] =
    await Promise.all([getAlbums(), getComments(), getPosts(), getUsers()]);

  const postsWithComments = posts.map(joinPostWithComments(comments));
  const usersWithAlbums = users.map(joinUserWithAlbums(albums));
  const postsWithCommentsAndUsers = postsWithComments.map(joinPostWithUser(usersWithAlbums));

  console.log(postsWithCommentsAndUsers);
})();
