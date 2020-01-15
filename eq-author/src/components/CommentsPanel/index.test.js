import React from "react";
import { render, flushPromises, fireEvent, act } from "tests/utils/rtl";
import { MeContext } from "App/MeContext";

import CommentsPanel from "./";
import COMMENT_QUERY from "./commentsQuery.graphql";
import COMMENT_ADD from "./createNewComment.graphql";
import COMMENT_DELETE from "./deleteComment.graphql";
import COMMENT_UPDATE from "./updateComment.graphql";
import COMMENT_SUBSCRIPTION from "./commentSubscription.graphql";
import REPLY_ADD from "./createNewReply.graphql";
import REPLY_DELETE from "./deleteReply.graphql";
import REPLY_UPDATE from "./updateReply.graphql";

describe("Comments Pane", () => {
  let queryWasCalled,
    createWasCalled,
    deleteWasCalled,
    updateWasCalled,
    newCommentSubscriptionWasCalled,
    createReplyWasCalled,
    deleteReplyWasCalled,
    updateReplyWasCalled,
    mocks,
    user,
    props;

  const origWindow = window.HTMLElement.prototype.scrollIntoView;

  afterEach(async () => {
    await act(async () => {
      await flushPromises();
    });
  });

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

    await act(async () => {
      await flushPromises();
    });

    expect(queryWasCalled).toBeTruthy();
    expect(getByTestId("comment-txt-area")).toBeTruthy();
  });

  it("should disable add button when comment txt area is empty", async () => {
    const { getByText } = renderWithContext(<CommentsPanel />, { ...props });

    await act(async () => {
      await flushPromises();
    });

    const addCommentButton = getByText("Add");

    expect(addCommentButton).toHaveAttribute("disabled");
  });

  it("should enable add button when comment txt area has content", async () => {
    const { getByText, getByTestId } = renderWithContext(<CommentsPanel />, {
      ...props,
    });

    await act(async () => {
      await flushPromises();
    });
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

    await act(async () => {
      await flushPromises();
    });
    expect(queryWasCalled).toBeTruthy();
    expect(getByText("Query comment body")).toBeTruthy();
  });

  it("should create a new comment", async () => {
    const { getByText, getByTestId } = renderWithContext(<CommentsPanel />, {
      ...props,
    });

    await act(async () => {
      await flushPromises();
    });

    fireEvent.change(getByTestId("comment-txt-area"), {
      target: { value: "This is a test ADD comment" },
    });
    await act(async () => {
      await fireEvent.click(getByTestId("btn-add-comment"));
    });

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
          query: COMMENT_SUBSCRIPTION,
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
    await act(async () => {
      await flushPromises();
    });

    expect(queryWasCalled).toBeTruthy();
    expect(getByText("Oops! Something went wrong")).toBeTruthy();
  });

  it("should hide delete button if comments exist && comment user !== me", async () => {
    const { getByTestId } = renderWithContext(<CommentsPanel />, {
      ...props,
    });

    await act(async () => {
      await flushPromises();
    });
    const deleteCommentButton = getByTestId("btn-delete-comment-0");

    expect(deleteCommentButton).toHaveStyleRule("display: none;");
  });

  it("should render enabled delete button if comments exist && user === me", async () => {
    const { getByTestId } = renderWithContext(<CommentsPanel />, { ...props });

    await act(async () => {
      await flushPromises();
    });
    const deleteCommentButton = getByTestId("btn-delete-comment-1");

    expect(deleteCommentButton).toHaveStyleRule("display: block");
  });

  it("should be able to delete an existing comment", async () => {
    const { getByText, getByTestId } = renderWithContext(<CommentsPanel />, {
      ...props,
    });

    await act(async () => {
      await flushPromises();
    });

    const comment = getByText("Query comment2 body");
    expect(comment).toBeTruthy();

    await act(async () => {
      await fireEvent.click(getByTestId("btn-delete-comment-1"));
    });

    expect(deleteWasCalled).toBeTruthy();
    expect(newCommentSubscriptionWasCalled).toBeTruthy();
    expect(comment).toBeTruthy();
  });

  it("should hide Edit button if comments exist && comment user !== me", async () => {
    const { getByTestId } = renderWithContext(<CommentsPanel />, { ...props });

    await act(async () => {
      await flushPromises();
    });
    const editCommentButton = getByTestId("btn-edit-comment-0");

    expect(editCommentButton).toHaveStyleRule("display: none;");
  });

  it("should render enabled Edit button if comments exist && user === me", async () => {
    const { getByTestId } = renderWithContext(<CommentsPanel />, { ...props });

    await act(async () => {
      await flushPromises();
    });
    const editCommentButton = getByTestId("btn-edit-comment-1");

    expect(editCommentButton).toHaveStyleRule("display: block");
  });

  it("should show a save button for an edit comment area when edit button is clicked", async () => {
    const { getByTestId } = renderWithContext(<CommentsPanel />, {
      ...props,
    });

    await act(async () => {
      await flushPromises();
    });
    fireEvent.click(getByTestId("btn-edit-comment-1"));

    const editSaveBtn = getByTestId("btn-save-editedComment-1");

    expect(editSaveBtn).toBeTruthy();
    expect(editSaveBtn).toHaveStyle("display: inline-flex");
  });

  it("should update a comment", async () => {
    const { getByText, getByTestId } = renderWithContext(<CommentsPanel />, {
      ...props,
    });

    await act(async () => {
      await flushPromises();
    });
    const editBtn = getByTestId("btn-edit-comment-1");
    fireEvent.click(editBtn);

    const editCommentTxtArea = getByTestId("edit-comment-txtArea-1");

    fireEvent.change(editCommentTxtArea, {
      target: { name: "name-1", value: "This is an edited comment" },
    });
    const editSaveBtn = getByTestId("btn-save-editedComment-1");
    expect(editSaveBtn).toHaveStyle("display: inline-flex");
    await act(async () => {
      await fireEvent.click(editSaveBtn);
    });

    expect(updateWasCalled).toBeTruthy();
    expect(newCommentSubscriptionWasCalled).toBeTruthy();
    expect(getByText("This is an edited comment")).toBeTruthy();
  });

  describe("Replies", () => {
    it("should render a previous reply", async () => {
      const { getByText } = renderWithContext(<CommentsPanel />, {
        ...props,
      });

      await act(async () => {
        await flushPromises();
      });

      expect(queryWasCalled).toBeTruthy();
      expect(getByText("Query reply body")).toBeTruthy();
    });

    it("should create a new reply", async () => {
      const { getByText, getByTestId } = renderWithContext(<CommentsPanel />, {
        ...props,
      });
      await act(async () => {
        await flushPromises();
        await fireEvent.click(getByTestId("btn-reply-comment-0"));
      });

      const replyTxtArea = getByTestId("reply-txtArea-0");
      expect(replyTxtArea).toHaveStyle("display: block");

      await act(async () => {
        await fireEvent.change(replyTxtArea, {
          target: {
            name: "reply-comment-0",
            value: "This is a test ADD reply",
          },
        });
        await flushPromises();
        await fireEvent.click(getByTestId("btn-save-reply-0"));
      });

      expect(createReplyWasCalled).toBeTruthy();
      expect(newCommentSubscriptionWasCalled).toBeTruthy();
      expect(getByText("This is a test ADD reply")).toBeTruthy();
    });

    it("should hide reply delete button if reply exist && comment user !== me", async () => {
      const { getByTestId } = renderWithContext(<CommentsPanel />, {
        ...props,
      });

      await act(async () => {
        await flushPromises();
      });
      const deleteCommentButton = getByTestId("btn-delete-reply-0-0");

      expect(deleteCommentButton).toHaveStyleRule("display: none;");
    });

    it("should render enabled delete button if reply exist && user === me", async () => {
      const { getByTestId } = renderWithContext(<CommentsPanel />, {
        ...props,
      });

      await act(async () => {
        await flushPromises();
      });
      const deleteCommentButton = getByTestId("btn-delete-reply-0-1");

      expect(deleteCommentButton).toHaveStyleRule("display: block");
    });

    it("should be able to delete an existing reply", async () => {
      const { getByText, getByTestId } = renderWithContext(<CommentsPanel />, {
        ...props,
      });

      await act(async () => {
        await flushPromises();
      });

      const reply = getByText("Query reply body2");
      expect(reply).toBeTruthy();

      await act(async () => {
        await fireEvent.click(getByTestId("btn-delete-reply-0-1"));
      });

      expect(deleteReplyWasCalled).toBeTruthy();
      expect(newCommentSubscriptionWasCalled).toBeTruthy();
      expect(reply).toBeTruthy();
    });

    it("should hide reply edit button if reply exist && comment user !== me", async () => {
      const { getByTestId } = renderWithContext(<CommentsPanel />, {
        ...props,
      });

      await act(async () => {
        await flushPromises();
      });
      const editReplyButton = getByTestId("btn-edit-reply-0-0");

      expect(editReplyButton).toHaveStyleRule("display: none;");
    });

    it("should render enabled edit reply button if reply exist && user === me", async () => {
      const { getByTestId } = renderWithContext(<CommentsPanel />, {
        ...props,
      });

      await act(async () => {
        await flushPromises();
      });
      const editReplyButton = getByTestId("btn-delete-reply-0-1");

      expect(editReplyButton).toHaveStyleRule("display: block");
    });

    it("should update a reply", async () => {
      const { getByText, getByTestId } = renderWithContext(<CommentsPanel />, {
        ...props,
      });

      await act(async () => {
        await flushPromises();
        const accordion = getByTestId("accordion-2-button");
        fireEvent.click(accordion);
      });

      await act(async () => {
        await flushPromises();
        const editReplyBtn = getByTestId("btn-edit-reply-0-1");
        fireEvent.click(editReplyBtn);
      });

      const editReplyTxtArea = getByTestId("reply-txtArea-0-1");

      await act(async () => {
        fireEvent.change(editReplyTxtArea, {
          target: {
            name: "edit-reply-0-1",
            value: "This is an edited reply",
          },
        });
      });

      const editReplySaveBtn = getByTestId("btn-save-editedReply-0-1");
      expect(editReplySaveBtn).toHaveStyle("display: inline-flex");
      await act(async () => {
        await fireEvent.click(editReplySaveBtn);
      });

      expect(updateReplyWasCalled).toBeTruthy();
      expect(newCommentSubscriptionWasCalled).toBeTruthy();
      expect(getByText("This is an edited reply")).toBeTruthy();
    });
  });
});
