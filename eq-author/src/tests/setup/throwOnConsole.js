/* eslint-disable no-console, import/unambiguous */
const actualConsoleError = console.error.bind(console);

console.error = jest.fn(function(msg, ...rest) {
  actualConsoleError(msg, ...rest);
  throw msg instanceof Error ? msg : new Error(msg);
});
