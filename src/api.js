const BASE_URL = 'https://jsonplaceholder.typicode.com';

const api = method =>
  fetch(`${BASE_URL}/${method}`).then(res => res.json());

export const getAlbums = () => api('albums');
export const getComments = () => api('comments');
export const getPhotos = () => api('photos');
export const getPosts = () => api('posts');
export const getTodos = () => api('todos');
export const getUsers = () => api('users');
