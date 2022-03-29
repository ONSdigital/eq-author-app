import React from "react";
import Theme from "contexts/themeContext";

import { render, queryByTestId } from "tests/utils/rtl";

import CommentsPanel from ".";

/**
 * Setup module mocks
 */

const mockUseSubscription = jest.fn();
const mockUseMutation = jest.fn();
const mockUseMe = { me: { id: "user-1" } };
const mockUseQuery = {
  loading: false,
  error: false,
  data: {
    comments: [
      {
        id: "comment-1",
        user: { id: "user-1", displayName: "Dina" },
        commentText:
          "It's all hands on deck, so quit your Myspacing and get on the register. That's an order.",
        createdTime: "2021-03-30T14:48:00.000Z",
        editedTime: null,
        replies: [],
        readBy: ["user-1"],
      },
      {
        id: "comment-2",
        user: { id: "user-1", displayName: "Dina" },
        commentText:
          "Has anyone noticed anything out of the ordinary back here? ",
        createdTime: "2021-03-30T14:49:00.000Z",
        editedTime: null,
        readBy: ["user-1"],
        replies: [
          {
            id: "comment-2-reply-1",
            user: { id: "user-2", displayName: "Amy" },
            commentText:
              "Well, it's Halloween, so everything's kind of out of the ordinary.",
            createdTime: "2021-03-30T15:01:00.000Z",
            editedTime: null,
            readBy: ["user-1"],
          },
        ],
      },
    ],
  },
};

jest.mock("@apollo/react-hooks", () => ({
  useMutation: () => [mockUseMutation],
  useQuery: () => mockUseQuery,
  useSubscription: () => [mockUseSubscription],
}));

jest.mock("App/MeContext", () => ({
  useMe: () => mockUseMe,
}));

/**
 * Tests
 */

describe("Comments panel", () => {
  const renderPanel = (props) =>
    render(
      <Theme>
        <CommentsPanel
          componentId="page-1"
          comments={mockUseQuery.data.comments}
          {...props}
        />
      </Theme>
    );

  afterEach(() => jest.clearAllMocks());

  it("Can render", () => {
    const { getByTestId } = renderPanel();

    const commentPanel = getByTestId("comments-panel");

    expect(commentPanel).toBeTruthy();
  });

  it("Puts the newest comment first", () => {
    const { getAllByTestId } = renderPanel();

    const comments = getAllByTestId("Comment__CommentText");

    const firstRenderedCommentText = comments[0].textContent;
    const newestCommentText = mockUseQuery.data.comments[1].commentText;

    expect(firstRenderedCommentText).toEqual(newestCommentText);
  });

  it("Doesn't show the replies collapsible if there are none", () => {
    const { getByTestId } = renderPanel();

    const { id, replies } = mockUseQuery.data.comments[0];

    const commentWrapper = getByTestId(`Comment-${id}`);

    const collapsible = queryByTestId(commentWrapper, "Collapsible");

    expect(replies.length).toBe(0);
    expect(collapsible).not.toBeInTheDocument();
  });

  it("Shows the replies collapsible if there are some", () => {
    const { getByTestId } = renderPanel();

    const { id, replies } = mockUseQuery.data.comments[1];

    const commentWrapper = getByTestId(`Comment-${id}`);

    const collapsible = queryByTestId(commentWrapper, "collapsible");

    expect(replies.length).toBe(1);
    expect(collapsible).toBeInTheDocument();
  });

  it("Should display loading state", () => {
    const props = { ...mockUseQuery, loading: true };
    const { getByTestId } = renderPanel(props);
    expect(getByTestId("loading")).toBeVisible();
  });

  it("Should display error state", () => {
    const props = { ...mockUseQuery, error: true };
    const { getByTestId } = renderPanel(props);
    expect(getByTestId("error")).toBeVisible();
  });

  it("Should not display comments if comments is undefined", () => {
    mockUseQuery.data.comments = undefined;
    const { queryByTestId, getByTestId } = renderPanel();
    const commentPanel = getByTestId("comments-panel");

    expect(queryByTestId("Comment__CommentText")).toBeFalsy();
    expect(commentPanel).toBeTruthy();
  });
});
