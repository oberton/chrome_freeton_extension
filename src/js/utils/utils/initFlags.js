import { writable } from 'svelte/store';

export function initFlags(list) {
  const state = _(list).map(key => [key, false]).fromPairs().value();

  const flag = writable(state);
  const toggleFlag = _(list).map(key => [key, (shown) => {
    state[key] = _.isBoolean(shown) ? shown : !state[key];
    flag.set({...state});
  }]).fromPairs().value();

  return { flag, toggleFlag };
}
export default initFlags;
