import COMMENT_QUERY from "./commentsQuery.graphql";
import COMMENT_ADD from "./createNewComment.graphql";
import COMMENT_DELETE from "./deleteComment.graphql";
import COMMENT_UPDATE from "./updateComment.graphql";
import COMMENT_SUBSCRIPTION from "./commentSubscription.graphql";
import REPLY_ADD from "./createNewReply.graphql";
import REPLY_DELETE from "./deleteReply.graphql";
import REPLY_UPDATE from "./updateReply.graphql";

let queryWasCalled,
  createWasCalled,
  deleteWasCalled,
  updateWasCalled,
  newCommentSubscriptionWasCalled,
  createReplyWasCalled,
  deleteReplyWasCalled,
  updateReplyWasCalled;

const mocks = [
  {
    request: {
      query: COMMENT_QUERY,
      variables: {
        input: { pageId: "P1" },
      },
    },
    result: () => {
      queryWasCalled = true;
      return {
        data: {
          page: {
            id: "P1",
            comments: [
              {
                commentText: "Query comment body",
                createdTime: "2019-10-16T07:39:46.984Z",
                editedTime: null,
                id: "C1",
                replies: [
                  {
                    id: "R1",
                    commentText: "Query reply body",
                    createdTime: "2020-01-09T09:23:21.431Z",
                    editedTime: null,
                    user: {
                      displayName: "My Name is Reply Query",
                      email: "test2@tester.com",
                      id: "U2",
                      name: "My Name is Reply Query",
                      picture: null,
                      __typename: "User",
                    },
                    __typename: "Reply",
                  },
                  {
                    id: "R2",
                    commentText: "Query reply body2",
                    createdTime: "2020-01-09T09:23:21.431Z",
                    editedTime: null,
                    user: {
                      displayName: "Fred Bundy",
                      email: "idibidiemama@a.com",
                      id: "me123",
                      name: "Fred Bundy",
                      picture: null,
                      __typename: "User",
                    },
                    __typename: "Reply",
                  },
                ],
                user: {
                  displayName: "My Name is Query",
                  email: "test@tester.com",
                  id: "U1",
                  name: "My Name is Query",
                  picture: null,
                  __typename: "User",
                },
                __typename: "Comment",
              },
              {
                commentText: "Query comment2 body",
                createdTime: "2019-10-17T07:39:46.984Z",
                editedTime: null,
                id: "C2",
                replies: [],
                user: {
                  displayName: "Fred Bundy",
                  email: "idibidiemama@a.com",
                  id: "me123",
                  name: "Fred Bundy",
                  picture: null,
                  __typename: "User",
                },
                __typename: "Comment",
              },
            ],
            __typename: "QuestionPage",
          },
        },
      };
    },
  },

  {
    request: {
      query: COMMENT_ADD,
      variables: {
        input: {
          pageId: "P1",
          commentText: "This is a test ADD comment",
        },
      },
    },
    result: () => {
      createWasCalled = true;
      return {
        data: {
          createComment: {
            id: "C1",
            commentText: "This is a test ADD comment",
            createdTime: "2019-10-17T07:15:19.229Z",
            editedTime: null,
            page: {
              id: "P1",
              comments: [
                {
                  id: "C1",
                  __typename: "Comment",
                },
              ],
              __typename: "QuestionPage",
            },
            user: {
              id: "U1",
              name: "Fred Jones",
              picture: null,
              email: "test@tester.com",
              displayName: "Fred Jones",
              __typename: "User",
            },
            replies: [],
            __typename: "Comment",
          },
        },
      };
    },
  },
  {
    request: {
      query: COMMENT_DELETE,
      variables: {
        input: { pageId: "P1", commentId: "C2" },
      },
    },
    result: () => {
      deleteWasCalled = true;
      return {
        data: {
          deleteComment: {
            id: "P1",
            comments: [
              {
                id: "C2",
                __typename: "Comment",
              },
            ],
            __typename: "QuestionPage",
          },
        },
      };
    },
  },
  {
    request: {
      query: COMMENT_UPDATE,
      variables: {
        input: {
          pageId: "P1",
          commentId: "C2",
          commentText: "This is an edited comment",
        },
      },
    },
    result: () => {
      updateWasCalled = true;
      return {
        data: {
          updateComment: {
            id: "C2",
            commentText: "This is an edited comment",
            editedTime: "2019-10-27T07:15:19.229Z",
            __typename: "Comment",
          },
        },
      };
    },
  },
  {
    request: {
      query: COMMENT_SUBSCRIPTION,
      variables: { pageId: "P1" },
    },
    result: () => {
      newCommentSubscriptionWasCalled = true;
      return {};
    },
  },
  {
    request: {
      query: REPLY_ADD,
      variables: {
        input: {
          pageId: "P1",
          commentId: "C1",
          commentText: "This is a test ADD reply",
        },
      },
    },
    result: () => {
      createReplyWasCalled = true;
      return {
        data: {
          createReply: {
            id: "R3",
            commentText: "This is a test ADD reply",
            createdTime: "2020-01-13T09:07:59.763Z",
            editedTime: null,
            user: {
              id: "me123",
              name: "Fred Bundy",
              picture: null,
              email: "idibidiemama@a.com",
              displayName: "Fred Bundy",
              __typename: "User",
            },
            parentComment: {
              id: "C1",
              page: {
                id: "P1",
                comments: [
                  {
                    id: "C1",
                    replies: [
                      {
                        id: "R1",
                        __typename: "Reply",
                      },
                      {
                        id: "R2",
                        __typename: "Reply",
                      },
                      {
                        id: "R3",
                        __typename: "Reply",
                      },
                    ],
                    __typename: "Comment",
                  },
                  { id: "C2", replies: [], __typename: "Comment" },
                ],
                __typename: "QuestionPage",
              },
              __typename: "Comment",
            },
            __typename: "Reply",
          },
        },
      };
    },
  },
  {
    request: {
      query: REPLY_DELETE,
      variables: {
        input: { pageId: "P1", commentId: "C1", replyId: "R2" },
      },
    },
    result: () => {
      deleteReplyWasCalled = true;
      return {
        data: {
          deleteReply: {
            id: "R2",
            comments: [
              {
                id: "C1",
                replies: [
                  {
                    id: "R2",
                    __typename: "Reply",
                  },
                ],
                __typename: "Comment",
              },
            ],
            __typename: "QuestionPage",
          },
        },
      };
    },
  },
  {
    request: {
      query: REPLY_UPDATE,
      variables: {
        input: {
          pageId: "P1",
          commentId: "C1",
          replyId: "R2",
          commentText: "This is an edited reply",
        },
      },
    },
    result: () => {
      updateReplyWasCalled = true;
      return {
        data: {
          updateReply: {
            id: "R2",
            commentText: "This is an edited reply",
            editedTime: "2019-10-27T07:15:19.229Z",
            __typename: "Reply",
          },
        },
      };
    },
  },
];

export {
  mocks,
  queryWasCalled,
  createWasCalled,
  deleteWasCalled,
  updateWasCalled,
  newCommentSubscriptionWasCalled,
  createReplyWasCalled,
  deleteReplyWasCalled,
  updateReplyWasCalled,
};
