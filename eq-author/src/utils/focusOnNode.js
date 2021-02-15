export default (ref) => {
  if (ref && ref.current) {
    ref.current.focus();
  }
};
