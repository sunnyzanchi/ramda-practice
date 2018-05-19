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

// Idk if this is normal with Ramda projects but it feels pretty heavy on the boilerplate
// And, if this was a bigger project, would I export & reuse something as simple as an id lens?
const idEq = propEq('id');
const postIdEq = propEq('postId');
const userIdEq = propEq('userId');
const withoutPostId = dissoc('postId');
const withoutUserId = dissoc('userId');

const idLens = lensProp('id');
const getId = view(idLens);
const setId = set(idLens);

const userIdLens = lensProp('userId');
const getUserId = view(userIdLens);

const resetIds = (item, i) => setId(i, item);

// I'm creating higher order functions here to use in map later,
// but I'm not sure if this is something I should be doing entirely with Ramda's API.
export const joinPostWithComments = comments => post => merge(
  post, {
    // The nesting is getting a lil deep here, maybe a spot to use the |> operator? 👀
    // Also, I know lenses can be composed and they don't mutate the original object,
    // but I don't really need that here. Is it better to be pragmatic and just do
    // `postIdEq(post.userId)`? I think `getUserId` looks really straighforward, no question what
    // it does, but I definitely don't think it looks like idiomatic JavaScript 🤔
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
      // TODO: I know this (and joinPostWithComments) is a probably a good spot for a transducer,
      // but I haven't used one yet. I need to figure out how that actually works
      .map(withoutUserId)
      .map(resetIds)
  }
);
