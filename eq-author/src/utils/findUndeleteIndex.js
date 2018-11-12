import { findIndex } from "lodash";

export const findUndeleteIndex = (array, id) => {
  let index = 0;

  if (array.length > 0) {
    const nextIndex = findIndex(
      array,
      item => parseInt(item.id, 10) > parseInt(id, 10)
    );
    if (nextIndex > 0) {
      index = nextIndex;
    } else if (nextIndex < 0) {
      index = array.length;
    }
  }

  return index;
};
