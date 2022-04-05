import React from "react";
import moment from "moment";

import { render } from "tests/utils/rtl";
import { MeContext } from "App/MeContext";
import Theme from "contexts/themeContext";

import Comment from ".";

const mockUseMutation = jest.fn();

jest.mock("@apollo/react-hooks", () => ({
  useMutation: () => [mockUseMutation],
}));

describe("Comment", () => {
  let mockComment;

  const user = {
    id: "1",
    name: "Name",
  };

  const renderComment = (props) =>
    render(
      <MeContext.Provider value={{ me: user }}>
        <Theme>
          <Comment {...mockComment} canDelete canEdit {...props} />
        </Theme>
      </MeContext.Provider>
    );

  beforeEach(() => {
    mockComment = {
      id: "1",
      rootId: "1",
      subjectId: "SomeQuestionPage",
      authorName: "Jane Doe",
      datePosted: "2021-03-30T14:48:00.000Z",
      commentText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Can render", () => {
    const { getByTestId } = renderComment();

    const comment = getByTestId("Comment");

    expect(comment).toBeVisible();
  });

  it("Uses the authors initials for their avatar", () => {
    const { getByText } = renderComment();

    const avatar = getByText("JD");

    expect(avatar).toBeVisible();
  });

  it("Converts an ISO date to the human readable date format", () => {
    const { getByText } = renderComment();

    const humanReadableDate = moment(mockComment.datePosted).calendar();

    expect(getByText(humanReadableDate)).toBeVisible();
  });

  it("Opens the Comment Editor when the Edit button is clicked", () => {
    const { getByTestId } = renderComment();

    const editBtn = getByTestId("Comment__EditCommentBtn");

    editBtn.click();

    const commentEditor = getByTestId("CommentEditor");

    expect(commentEditor).toBeVisible();
  });

  it("Calls the database when the delete button is clicked", () => {
    const { getByTestId } = renderComment();

    const deleteBtn = getByTestId("Comment__DeleteCommentBtn");

    deleteBtn.click();

    expect(mockUseMutation.mock.calls.length).toBe(1);
    expect(mockUseMutation).toBeCalledWith({
      variables: {
        input: {
          commentId: mockComment.id,
          componentId: mockComment.subjectId,
        },
      },
    });
  });
});
