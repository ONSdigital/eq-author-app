const executeQuery = require("../../executeQuery");

const deleteCommentMutation = `
 mutation deleteComment($input: DeleteCommentInput!) {
  deleteComment(input: $input) {
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
  }
}
`;

const deleteComment = async (ctx, input) => {
  const result = await executeQuery(deleteCommentMutation, { input }, ctx);

  if (result.errors) {
    throw new Error(result.errors[0]);
  }

  return result.data.deleteComment;
};

module.exports = {
  deleteCommentMutation,
  deleteComment,
};
