const executeQuery = require("../../executeQuery");

const deleteReplyMutation = `
mutation DeleteReply($input: DeleteReplyInput!) {
  deleteReply(input: $input) {
    questionnaireIntroduction {
      id
      comments {
        id
        replies {
          id
        }
      }
    }
    section {
      id
      comments {
        id
        replies {
          id
        } 
      } 
    }
    page {
      id
      comments {
        id
        replies {
          id
        }
      }
    }
    confirmationPage {
      id
      comments {
        id
        replies {
          id
        }
      }
    }
  }
}
`;

const deleteReply = async (ctx, input) => {
  const result = await executeQuery(deleteReplyMutation, { input }, ctx);

  if (result.errors) {
    throw new Error(result.errors[0]);
  }

  return result.data.deleteReply;
};

module.exports = {
  deleteReplyMutation,
  deleteReply,
};
