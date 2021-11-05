// https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
export default (arr, oldIndex, newIndex) => {
  console.log(`OLD arr`, arr);
  console.log(`oldIndex`, oldIndex);
  console.log(`newIndex`, newIndex);
  if (newIndex >= arr.length) {
    var k = newIndex - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  console.log(`NEW arr`, arr);
  return arr; // for testing
};
