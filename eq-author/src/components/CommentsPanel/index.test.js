import React from "react";
import { render, flushPromises, fireEvent } from "tests/utils/rtl";
import { MeContext } from "App/MeContext";
import actSilenceWarning from "tests/utils/actSilenceWarning";
import gql from "graphql-tag";

import CommentsPanel from "./";
import COMMENT_QUERY from "./commentsQuery.graphql";
import COMMENT_ADD from "./createNewComment.graphql";
import COMMENT_DELETE from "./deleteComment.graphql";
import COMMENT_UPDATE from "./updateComment.graphql";

describe("Comments Pane", () => {
  let queryWasCalled,
    createWasCalled,
    deleteWasCalled,
    updateWasCalled,
    newCommentSubscriptionWasCalled,
    mocks,
    user,
    props;

  // this is just a little hack to silence a warning that we'll get until we
  // upgrade to 16.9: https://github.com/facebook/react/pull/14853
  // https://github.com/testing-library/react-testing-library#suppressing-unnecessary-warnings-on-react-dom-168
  actSilenceWarning();

  const origWindow = window.HTMLElement.prototype.scrollIntoView;

  const commentsSubscription = gql`
    subscription CommentsUpdated($pageId: ID!) {
      commentsUpdated(pageId: $pageId) {
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
        }
      }
    }
  `;

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  afterAll(() => {
    window.HTMLElement.prototype.scrollIntoView = origWindow;
  });

  beforeEach(() => {
    queryWasCalled = false;
    newCommentSubscriptionWasCalled = false;

    user = {
      id: "me123",
      displayName: "Fred Bundy",
      email: "idibidiemama@a.com",
      picture: "",
      admin: true,
    };

    mocks = [
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
                    replies: [],
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
          query: commentsSubscription,
          variables: { pageId: "P1" },
        },
        result: () => {
          newCommentSubscriptionWasCalled = true;
          return {};
        },
      },
    ];
    props = {
      route: "/q/Q1/page/P1",
      urlParamMatcher: "/q/:questionnaireId/page/:pageId",
      mocks,
    };
  });

  const renderWithContext = (component, ...props) =>
    render(
      <MeContext.Provider value={{ me: user }}>{component}</MeContext.Provider>,
      ...props
    );

  it("should render comments txt area", async () => {
    const { getByTestId } = renderWithContext(<CommentsPanel />, {
      ...props,
    });

    await flushPromises();
    expect(queryWasCalled).toBeTruthy();
    expect(getByTestId("comment-txt-area")).toBeTruthy();
  });

  it("should disable add button when comment txt area is empty", async () => {
    const { getByText } = renderWithContext(<CommentsPanel />, { ...props });

    await flushPromises();
    const addCommentButton = getByText("Add");

    expect(addCommentButton).toHaveAttribute("disabled");
  });

  it("should enable add button when comment txt area has content", async () => {
    const { getByText, getByTestId } = renderWithContext(<CommentsPanel />, {
      ...props,
    });

    await flushPromises();
    const addCommentButton = getByText("Add");

    fireEvent.change(getByTestId("comment-txt-area"), {
      target: { value: "abc" },
    });

    expect(addCommentButton).not.toHaveAttribute("disabled");
  });

  it("should render a previous comment", async () => {
    const { getByText } = renderWithContext(<CommentsPanel />, {
      ...props,
    });

    await flushPromises();
    expect(queryWasCalled).toBeTruthy();
    expect(getByText("Query comment body")).toBeTruthy();
  });

  it("should create a new comment", async () => {
    const { getByText, getByTestId } = renderWithContext(<CommentsPanel />, {
      ...props,
    });

    await flushPromises();

    fireEvent.change(getByTestId("comment-txt-area"), {
      target: { value: "This is a test ADD comment" },
    });
    fireEvent.click(getByTestId("btn-add-comment"));

    await flushPromises();

    expect(createWasCalled).toBeTruthy();
    expect(newCommentSubscriptionWasCalled).toBeTruthy();
    expect(getByText("This is a test ADD comment")).toBeTruthy();
  });

  it("should render loading state", () => {
    const { getByTestId } = renderWithContext(<CommentsPanel />, { ...props });
    expect(getByTestId("loading")).toBeTruthy();
  });

  it("should render error state on failed query", async () => {
    const mocks = [
      {
        request: {
          query: COMMENT_QUERY,
          variables: {
            input: { pageId: "P2" },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {},
            errors: ["Oops! Something went wrong"],
          };
        },
      },
      {
        request: {
          query: commentsSubscription,
          variables: { pageId: "P2" },
        },
        result: () => {
          newCommentSubscriptionWasCalled = true;
          return {};
        },
      },
    ];

    props = {
      route: "/q/Q2/page/P2",
      urlParamMatcher: "/q/:questionnaireId/page/:pageId",
      mocks,
    };
    const { getByText } = renderWithContext(<CommentsPanel />, {
      ...props,
    });
    await flushPromises();

    expect(queryWasCalled).toBeTruthy();
    expect(getByText("Oops! Something went wrong")).toBeTruthy();
  });

  it("should hide delete button if comments exist && comment user !== me", async () => {
    const { getByTestId } = renderWithContext(<CommentsPanel />, {
      ...props,
    });

    await flushPromises();
    const deleteCommentButton = getByTestId("btn-delete-comment-0");

    expect(deleteCommentButton).toHaveStyleRule("display: none;");
  });

  it("should render enabled delete button if comments exist && user === me", async () => {
    const { getByTestId } = renderWithContext(<CommentsPanel />, { ...props });

    await flushPromises();
    const deleteCommentButton = getByTestId("btn-delete-comment-1");

    expect(deleteCommentButton).toHaveStyleRule("display: block");
  });

  it("should be able to delete an existing comment", async () => {
    const { getByText, getByTestId } = renderWithContext(<CommentsPanel />, {
      ...props,
    });

    await flushPromises();

    const comment = getByText("Query comment2 body");
    expect(comment).toBeTruthy();

    fireEvent.click(getByTestId("btn-delete-comment-1"));
    await flushPromises();

    expect(deleteWasCalled).toBeTruthy();
    expect(newCommentSubscriptionWasCalled).toBeTruthy();
    expect(comment).toBeTruthy();
  });

  it("should hide Edit button if comments exist && comment user !== me", async () => {
    const { getByTestId } = renderWithContext(<CommentsPanel />, { ...props });

    await flushPromises();
    const editCommentButton = getByTestId("btn-edit-comment-0");

    expect(editCommentButton).toHaveStyleRule("display: none;");
  });

  it("should render enabled Edit button if comments exist && user === me", async () => {
    const { getByTestId } = renderWithContext(<CommentsPanel />, { ...props });

    await flushPromises();
    const editCommentButton = getByTestId("btn-edit-comment-1");

    expect(editCommentButton).toHaveStyleRule("display: block");
  });

  it("should show a save button for an edit comment area when edit button is clicked", async () => {
    const { getByTestId } = renderWithContext(<CommentsPanel />, {
      ...props,
    });

    await flushPromises();
    fireEvent.click(getByTestId("btn-edit-comment-1"));

    const editSaveBtn = getByTestId("btn-save-editedComment-1");

    expect(editSaveBtn).toBeTruthy();
    expect(editSaveBtn).toHaveStyle("display: inline-flex");
  });

  it("should update a comment", async () => {
    const { getByText, getByTestId } = renderWithContext(<CommentsPanel />, {
      ...props,
    });

    await flushPromises();
    const editBtn = getByTestId("btn-edit-comment-1");
    fireEvent.click(editBtn);

    const editCommentTxtArea = getByTestId("edit-comment-txtArea-1");

    fireEvent.change(editCommentTxtArea, {
      target: { name: "name-1", value: "This is an edited comment" },
    });
    const editSaveBtn = getByTestId("btn-save-editedComment-1");
    expect(editSaveBtn).toHaveStyle("display: inline-flex");

    fireEvent.click(editSaveBtn);

    await flushPromises();

    expect(updateWasCalled).toBeTruthy();
    expect(newCommentSubscriptionWasCalled).toBeTruthy();
    expect(getByText("This is an edited comment")).toBeTruthy();
  });
});
