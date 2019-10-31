import React from "react";
import { render, flushPromises, fireEvent } from "tests/utils/rtl";
import actSilenceWarning from "tests/utils/actSilenceWarning";

import CommentsPanel from "./";
import COMMENT_QUERY from "./commentsQuery.graphql";
import COMMENT_ADD from "./createNewComment.graphql";

describe("Comments Pane", () => {
  let queryWasCalled, mocks, props;

  // this is just a little hack to silence a warning that we'll get until we
  // upgrade to 16.9: https://github.com/facebook/react/pull/14853
  // https://github.com/testing-library/react-testing-library#suppressing-unnecessary-warnings-on-react-dom-168
  actSilenceWarning();

  beforeEach(() => {
    queryWasCalled = false;

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
                    id: "C1",
                    replies: [],
                    user: {
                      displayName: "Fred Jones",
                      email: "test@tester.com",
                      id: "U1",
                      name: "Fred Jones",
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
          queryWasCalled = true;
          return {
            data: {
              createComment: {
                id: "C1",
                commentText: "This is a test ADD comment",
                createdTime: "2019-10-17T07:15:19.229Z",
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
    ];
    props = {
      route: "/q/Q1/page/P1",
      urlParamMatcher: "/q/:questionnaireId/page/:pageId",
      mocks,
    };
  });

  it("should render comments txt area", async () => {
    const { getByTestId } = render(<CommentsPanel />, { ...props });

    await flushPromises();
    expect(queryWasCalled).toBeTruthy();
    expect(getByTestId("comment-txt-area")).toBeTruthy();
  });

  it("should disable add button when comment txt area is empty", async () => {
    const { getByText } = render(<CommentsPanel />, { ...props });

    await flushPromises();
    const addCommentButton = getByText("Add");

    expect(queryWasCalled).toBeTruthy();
    expect(addCommentButton).toHaveAttribute("disabled");
  });

  it("should enable add button when comment txt area has content", async () => {
    const { getByText, getByTestId } = render(<CommentsPanel />, { ...props });

    await flushPromises();
    const addCommentButton = getByText("Add");

    fireEvent.change(getByTestId("comment-txt-area"), {
      target: { value: "abc" },
    });

    expect(queryWasCalled).toBeTruthy();
    expect(addCommentButton).not.toHaveAttribute("disabled");
  });

  it("should render a previous comment", async () => {
    const { getByText } = render(<CommentsPanel />, { ...props });

    await flushPromises();

    expect(queryWasCalled).toBeTruthy();
    expect(getByText("Query comment body")).toBeTruthy();
  });

  it("should create a new comment", async () => {
    const { getByText, getByTestId } = render(<CommentsPanel />, { ...props });

    await flushPromises();

    fireEvent.change(getByTestId("comment-txt-area"), {
      target: { value: "This is a test ADD comment" },
    });
    fireEvent.click(getByTestId("btn-add-comment"));

    await flushPromises();

    expect(queryWasCalled).toBeTruthy();
    expect(getByText("This is a test ADD comment")).toBeTruthy();
  });

  it("should render loading state", () => {
    const { getByTestId } = render(<CommentsPanel />, { ...props });
    expect(getByTestId("loading")).toBeTruthy();
  });

  it("should render error state on failed query", async () => {
    const { getByText } = render(<CommentsPanel />, {
      route: "/q/Q2/page/P2",
      urlParamMatcher: "/q/:questionnaireId/page/:pageId",
      mocks,
    });
    await flushPromises();

    expect(queryWasCalled).toBeTruthy();
    expect(getByText("Oops! Something went wrong")).toBeTruthy();
  });
});
