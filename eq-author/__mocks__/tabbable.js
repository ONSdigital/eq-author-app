// https://stackoverflow.com/questions/72762696/jest-error-your-focus-trap-must-have-at-least-one-container-with-at-least-one
// https://github.com/focus-trap/tabbable#testing-in-jsdom
// eslint-disable-next-line import/unambiguous
const lib = jest.requireActual("tabbable");

const tabbable = {
  ...lib,
  tabbable: (node, options) =>
    lib.tabbable(node, { ...options, displayCheck: "none" }),
  focusable: (node, options) =>
    lib.focusable(node, { ...options, displayCheck: "none" }),
  isFocusable: (node, options) =>
    lib.isFocusable(node, { ...options, displayCheck: "none" }),
  isTabbable: (node, options) =>
    lib.isTabbable(node, { ...options, displayCheck: "none" }),
};

module.exports = tabbable;
