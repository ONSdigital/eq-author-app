import React from "react";
import { render, flushPromises, fireEvent, act } from "tests/utils/rtl";
import { MeContext } from "App/MeContext";
import COMMENT_QUERY from "./graphql/commentsQuery.graphql";
import COMMENT_SUBSCRIPTION from "./graphql/commentSubscription.graphql";

import mocks from "./setupTests";
import CommentsPanel from "./";

describe("Comments Panel", () => {
  let user, props;
  const vars = {};

  afterEach(async () => {
    await act(async () => {
      await flushPromises();
    });
  });

  beforeEach(() => {
    vars.queryWasCalled = false;
    vars.createWasCalled = false;
    vars.deleteWasCalled = false;
    vars.updateWasCalled = false;
    vars.newCommentSubscriptionWasCalled = false;
    vars.createReplyWasCalled = false;
    vars.deleteReplyWasCalled = false;
    vars.updateReplyWasCalled = false;

    user = {
      id: "me123",
      displayName: "Fred Bundy",
      email: "idibidiemama@a.com",
      picture: "",
      admin: true,
    };

    props = {
      route: "/q/Q1/page/P1",
      urlParamMatcher: "/q/:questionnaireId/page/:pageId",
      mocks: mocks(vars),
    };
  });

  const renderWithContext = (component, ...props) =>
    render(
      <MeContext.Provider value={{ me: user }}>{component}</MeContext.Provider>,
      ...props
    );

  it("should render comments txt area", async () => {
    const { getByTestId } = renderWithContext(
      <CommentsPanel componentId={"P1"} />,
      {
        ...props,
      }
    );

    await act(async () => {
      await flushPromises();
    });

    expect(vars.queryWasCalled).toBeTruthy();
    expect(getByTestId("comment-txt-area")).toBeTruthy();
  });

  it("should disable add button when comment txt area is empty", async () => {
    const { getByText } = renderWithContext(
      <CommentsPanel componentId={"P1"} />,
      { ...props }
    );

    await act(async () => {
      await flushPromises();
    });

    const addCommentButton = getByText("Add");

    expect(addCommentButton).toHaveAttribute("disabled");
  });

  it("should enable add button when comment txt area has content", async () => {
    const { getByText, getByTestId } = renderWithContext(
      <CommentsPanel componentId={"P1"} />,
      {
        ...props,
      }
    );

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
    const { getByText } = renderWithContext(
      <CommentsPanel componentId={"P1"} />,
      {
        ...props,
      }
    );

    await act(async () => {
      await flushPromises();
    });
    expect(vars.queryWasCalled).toBeTruthy();
    expect(getByText("Query comment body")).toBeTruthy();
  });

  it("should create a new comment", async () => {
    const { getByText, getByTestId } = renderWithContext(
      <CommentsPanel componentId={"P1"} />,
      {
        ...props,
      }
    );

    await act(async () => {
      await flushPromises();
    });

    fireEvent.change(getByTestId("comment-txt-area"), {
      target: { value: "This is a test ADD comment" },
    });
    await act(async () => {
      await fireEvent.click(getByTestId("btn-add-comment"));
    });

    expect(vars.createWasCalled).toBeTruthy();
    expect(vars.newCommentSubscriptionWasCalled).toBeTruthy();
    expect(getByText("This is a test ADD comment")).toBeTruthy();
  });

  it("should render loading state", () => {
    const { getByTestId } = renderWithContext(
      <CommentsPanel componentId={"P1"} />,
      { ...props }
    );
    expect(getByTestId("loading")).toBeTruthy();
  });

  it("should render error state on failed query", async () => {
    const mocks = [
      {
        request: {
          query: COMMENT_QUERY,
          variables: {
            componentId: "P1",
          },
        },
        result: () => {
          vars.queryWasCalled = true;
          return {
            data: {},
            errors: ["Oops! Something went wrong"],
          };
        },
      },
      {
        request: {
          query: COMMENT_SUBSCRIPTION,
          variables: { id: "P1" },
        },
        result: () => {
          vars.newCommentSubscriptionWasCalled = true;
          return {};
        },
      },
    ];

    props = {
      route: "/q/Q2/page/P2",
      urlParamMatcher: "/q/:questionnaireId/page/:pageId",
      mocks,
    };
    const { getByText } = renderWithContext(
      <CommentsPanel componentId={"P1"} />,
      {
        ...props,
      }
    );
    await act(async () => {
      await flushPromises();
    });

    expect(vars.queryWasCalled).toBeTruthy();
    expect(vars.newCommentSubscriptionWasCalled).toBeTruthy();
    expect(getByText("Oops! Something went wrong")).toBeTruthy();
  });

  it("should handle editing a comment", async () => {
    const { getByTestId, getByText } = renderWithContext(
      <CommentsPanel componentId={"P1"} />,
      {
        ...props,
      }
    );

    await act(async () => {
      await flushPromises();
    });

    fireEvent.click(getByTestId("btn-edit-0"));

    fireEvent.change(getByTestId("edit-comment-txtArea-0"), {
      target: { value: "This is a test ADD comment" },
    });

    expect(getByText("This is a test ADD comment")).toBeTruthy();
  });

  it("should be able to delete an existing comment", async () => {
    const { getByText, getByTestId, queryByTestId } = renderWithContext(
      <CommentsPanel componentId={"P1"} />,
      {
        ...props,
      }
    );

    await act(async () => {
      await flushPromises();
    });

    const comment = getByText("Query comment2 body");
    expect(comment).toBeTruthy();

    await act(async () => {
      fireEvent.click(getByTestId("btn-delete-1"));
    });

    expect(vars.deleteWasCalled).toBeTruthy();
    expect(vars.newCommentSubscriptionWasCalled).toBeTruthy();

    expect(queryByTestId("Query comment2 body")).toBeNull();
  });

  it("should hide Edit button if comments exist && comment user !== me", async () => {
    const { getByTestId } = renderWithContext(
      <CommentsPanel componentId={"P1"} />,
      { ...props }
    );

    await act(async () => {
      await flushPromises();
    });
    const editCommentButton = getByTestId("btn-edit-0");

    expect(editCommentButton).not.toBeVisible();
  });

  it("should hide delete button if comments exist && comment user !== me", async () => {
    const { getByTestId } = renderWithContext(
      <CommentsPanel componentId={"P1"} />,
      {
        ...props,
      }
    );

    await act(async () => {
      await flushPromises();
    });
    const deleteCommentButton = getByTestId("btn-delete-0");
    expect(deleteCommentButton).not.toBeVisible();
  });

  it("should render enabled delete button if comments exist && user === me", async () => {
    const { getByTestId } = renderWithContext(
      <CommentsPanel componentId={"P1"} />,
      { ...props }
    );

    await act(async () => {
      await flushPromises();
    });
    const deleteCommentButton = getByTestId("btn-delete-1");
    expect(deleteCommentButton).toBeVisible();
  });

  it("should render enabled Edit button if comments exist && user === me", async () => {
    const { getByTestId } = renderWithContext(
      <CommentsPanel componentId={"P1"} />,
      { ...props }
    );

    await act(async () => {
      await flushPromises();
    });
    const editCommentButton = getByTestId("btn-edit-1");
    expect(editCommentButton).toBeVisible();
  });

  it("should update a comment", async () => {
    const { getByTestId, getByText } = renderWithContext(
      <CommentsPanel componentId={"P1"} />,
      {
        ...props,
      }
    );

    await act(async () => {
      await flushPromises();
    });

    const editBtn = getByTestId("btn-edit-1");
    act(() => {
      fireEvent.click(editBtn);
    });

    const editCommentTxtArea = getByTestId("edit-comment-txtArea-1");

    await act(async () => {
      fireEvent.change(editCommentTxtArea, {
        target: { name: "name-1", value: "This is an edited comment" },
      });
    });

    const editSaveBtn = getByTestId("btn-save-editedComment-1");
    expect(editSaveBtn).toHaveStyle("display: inline-flex");
    await act(async () => {
      fireEvent.click(editSaveBtn);
    });

    expect(vars.updateWasCalled).toBeTruthy();
    expect(vars.newCommentSubscriptionWasCalled).toBeTruthy();
    expect(getByText("This is an edited comment")).toBeTruthy();
  });

  describe("Replies", () => {
    it("should update a reply", async () => {
      const { getByText, getByTestId } = renderWithContext(
        <CommentsPanel componentId={"P1"} />,
        {
          ...props,
        }
      );
      await act(async () => {
        await flushPromises();
        const accordion = getByTestId("accordion-2-button");
        fireEvent.click(accordion);
      });

      await act(async () => {
        await flushPromises();
        const editReplyBtn = getByTestId("btn-edit-0-1");
        fireEvent.click(editReplyBtn);
      });

      const editReplyTxtArea = getByTestId("reply-txtArea-0-1");
      await act(async () => {
        fireEvent.change(editReplyTxtArea, {
          target: {
            value: "This is an edited reply",
          },
        });
      });

      const editReplySaveBtn = getByTestId("btn-save-editedReply-0-1");
      expect(editReplySaveBtn).toBeVisible();
      await act(async () => {
        await fireEvent.click(editReplySaveBtn);
      });
      expect(vars.updateReplyWasCalled).toBeTruthy();
      expect(vars.newCommentSubscriptionWasCalled).toBeTruthy();
      expect(getByText("This is an edited reply")).toBeTruthy();
    });
  });
});
