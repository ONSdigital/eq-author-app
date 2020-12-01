import { findIndex } from "lodash";

export default (items, id) => {
  const index = findIndex(items, { id });
  let nextIndex;

  if (index === 0) {
    nextIndex = 0;
  } else {
    nextIndex = index - 1;
  }

  return nextIndex;
};
