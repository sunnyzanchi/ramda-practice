// parcel's treeshaking isn't totally working yet so we have to do this
// to avoid bundling the entirety of ramda
import dissoc from 'ramda/es/dissoc';
import filter from 'ramda/es/filter';
import find from 'ramda/es/find';
import lensProp from 'ramda/es/lensProp';
import merge from 'ramda/es/merge';
import propEq from 'ramda/es/propEq';
import set from 'ramda/es/set';
import view from 'ramda/es/view';

const idEq = propEq('id');
const postIdEq = propEq('postId');
const userIdEq = propEq('userId');
const withoutId = dissoc('id');
const withoutPostId = dissoc('postId');
const withoutUserId = dissoc('userId');

const idLens = lensProp('id');
const getId = view(idLens);
const setId = set(idLens);

const userIdLens = lensProp('userId');
const getUserId = view(userIdLens);

const resetIds = (item, i) => setId(i, withoutId(item));

export const joinPostWithComments = comments => post => merge(
  post, {
    comments: filter(postIdEq(getUserId(post)))(comments)
      .map(withoutPostId)
      .map(resetIds)
  }
);

export const joinPostWithUser = users => post => merge(
  withoutUserId(post), {
    user: find(idEq(getUserId(post)))(users)
  }
);

export const joinUserWithAlbums = albums => user => merge(
  user, {
    albums: filter(userIdEq(getId(user)))(albums)
      .map(withoutUserId)
      .map(resetIds)
  }
);
