const executeQuery = require("../../executeQuery");

const getComments = `
query CommentsQuery($input: QueryInput, $id: ID) {
  section(input: $input) {
    id
    comments {
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
      }
    }
  }
  page(input: $input) {
    id
    comments {
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
      }
    }
  }
  questionnaireIntroduction(id: $id) {
    id
    comments {
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
      }
    }
  }
  confirmationPage(input: $input) {
    id
    comments {
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
      }
    }
  }
}`;

const queryComments = async (ctx, input) => {
  const result = await executeQuery(getComments, { input }, ctx);

  if (result.errors) {
    throw new Error(result.errors[0]);
  }
  return result.data;
};

module.exports = {
  getComments,
  queryComments,
};
