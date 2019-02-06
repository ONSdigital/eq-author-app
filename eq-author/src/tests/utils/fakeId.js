export default fill => {
  if (fill.length > 1) {
    throw new Error("Only expecting a single character to be fill");
  }
  const a = new Array(36);
  a.fill(fill);
  return a.join("");
};
