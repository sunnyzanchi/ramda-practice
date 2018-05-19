import { getAlbums, getPosts, getComments, getUsers } from './api';
import { joinPostWithComments, joinUserWithAlbums, joinPostWithUser } from './utils';

(async () => {
  const [albums, comments, posts, users] =
    await Promise.all([getAlbums(), getComments(), getPosts(), getUsers()]);

  const postsWithComments = posts.map(joinPostWithComments(comments));
  const usersWithAlbums = users.map(joinUserWithAlbums(albums));
  const postsWithCommentsAndUsers = postsWithComments.map(joinPostWithUser(usersWithAlbums));

  console.log(postsWithCommentsAndUsers);
})();
