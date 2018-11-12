/* eslint-disable no-console, import/unambiguous */
const actualConsoleError = console.error.bind(console);

console.error = jest.fn(function(msg) {
  actualConsoleError(msg);
  throw msg instanceof Error ? msg : new Error(msg);
});
