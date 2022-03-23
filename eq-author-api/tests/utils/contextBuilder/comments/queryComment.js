const executeQuery = require("../../executeQuery");

const getComments = `
query Comments($componentId: ID!) {
  comments(id: $componentId) {
    id
    commentText
    user {
      id
      name
      picture
      email
      displayName
    }
    createdTime
    editedTime
    replies {
      id
      commentText
      createdTime
      editedTime
      user {
        id
        name
        picture
        email
        displayName
      }
      readBy
    }
    readBy
  }
}`;

const queryComments = async (ctx, componentId) => {
  const result = await executeQuery(getComments, { componentId }, ctx);

  if (result.errors) {
    throw new Error(result.errors[0]);
  }
  return result.data;
};

module.exports = {
  getComments,
  queryComments,
};
