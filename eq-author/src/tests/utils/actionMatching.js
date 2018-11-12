export default function actionMatching(type, payload) {
  var action = { type };

  if (arguments.length === 2) {
    action.payload = payload;
  }

  return expect.objectContaining(action);
}
