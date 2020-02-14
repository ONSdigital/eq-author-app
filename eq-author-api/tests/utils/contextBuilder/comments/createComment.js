const executeQuery = require("../../executeQuery");

const createCommentMutation = `
mutation createComment($input: CreateCommentInput!) {
  createComment(input: $input) {
    id
    commentText
    createdTime
    editedTime
    questionnaireIntroduction {
      id
      comments {
        id
      }
    }
    section {
      id
      comments {
        id
      }
    }
    page {
      id
      comments {
        id
      }
    }
    confirmationPage {
      id
      comments {
        id
      }
    }
    user {
      id
      name
      picture
      email
      displayName
    }
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
    }
  }
}`;

const createComment = async (ctx, input) => {
  const result = await executeQuery(createCommentMutation, { input }, ctx);

  if (result.errors) {
    throw new Error(result.errors[0]);
  }

  return result.data.createComment;
};

module.exports = {
  createCommentMutation,
  createComment,
};
