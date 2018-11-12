import { findIndex } from "lodash";

export default (items, id) => {
  const index = findIndex(items, { id });
  let nextIndex;

  if (index === 0) {
    if (items.length === 1) {
      nextIndex = 0;
    } else {
      nextIndex = index + 1;
    }
  } else {
    nextIndex = index - 1;
  }

  return items[nextIndex];
};
