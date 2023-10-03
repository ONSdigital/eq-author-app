import React from "react";
import { render } from "tests/utils/rtl";
import { useQuery } from "@apollo/react-hooks";

import { MeContext } from "App/MeContext";

import AddItemPagePreview from ".";

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual("@apollo/react-hooks"),
  useMutation: jest.fn(() => [() => null]),
  useQuery: jest.fn(),
  useSubscription: jest.fn(() => jest.fn()),
}));

const me = {
  id: "me",
  name: "test",
};

const questionnaire = { id: "questionnaire-1" };

const renderAddItemPagePreview = (props) => {
  return render(
    <MeContext.Provider value={{ me }}>
      <AddItemPagePreview {...props} />
    </MeContext.Provider>,
    {
      route: `/q/${questionnaire.id}/page/${props.page.id}/preview`,
      urlParamMatcher: "/q/:questionnaireId/page/:pageId/preview",
    }
  );
};

describe("AddItemPagePreview", () => {
  let props;
  beforeEach(() => {
    const page = {
      id: "page-1",
      title: "Page 1",
      displayName: "Page 1",
      pageType: "ListCollectorAddItemPage",
      definitionEnabled: true,
      additionalInfoContent: "additionalInfoContent",
      description: "description",
      definitionLabel: "",
      additionalInfoLabel: "",
      descriptionEnabled: true,
      additionalInfoEnabled: true,
      definitionContent: "",
      guidanceEnabled: false,
      folder: { id: "folder-1", listId: "list-1" },
      section: { id: "section-1" },
      comments: [],
      validationErrorInfo: { id: "validation-error-info", errors: [] },
    };

    useQuery.mockImplementation(() => ({
      loading: false,
      error: false,
      data: {
        collectionLists: {
          id: "collection-lists",
          lists: [
            {
              id: "list-1",
              listName: "List 1",
              displayName: "List 1",
              answers: [
                {
                  id: "answer-1",
                  type: "TextField",
                  label: "Answer 1",
                },
                {
                  id: "answer-2",
                  type: "TextField",
                  label: "Answer 2",
                },
              ],
            },
          ],
        },
      },
    }));

    props = { page };
  });

  it("should render loading page", () => {
    useQuery.mockImplementationOnce(() => ({
      loading: true,
    }));

    const { getByTestId } = renderAddItemPagePreview(props);

    expect(getByTestId("loading")).toBeInTheDocument();
  });

  it("should render error page", () => {
    useQuery.mockImplementationOnce(() => ({
      error: true,
    }));

    const { getByTestId } = renderAddItemPagePreview(props);

    expect(getByTestId("error")).toBeInTheDocument();
  });

  it("should render add item preview page", () => {
    const { getByTestId } = renderAddItemPagePreview(props);

    expect(
      getByTestId("list-collector-add-item-page-preview")
    ).toBeInTheDocument();
  });

  it("should render list not selected text when no list selected", () => {
    props.page.folder.listId = null;
    const { getByText } = renderAddItemPagePreview(props);

    expect(getByText(/Collection list is not selected/)).toBeInTheDocument();
  });

  it("should render no answers text when selected list has no answers", () => {
    useQuery.mockImplementation(() => ({
      loading: false,
      error: false,
      data: {
        collectionLists: {
          id: "collection-lists",
          lists: [
            {
              id: "list-1",
              listName: "List 1",
              displayName: "List 1",
              answers: [],
            },
          ],
        },
      },
    }));
    const { getByText } = renderAddItemPagePreview(props);

    expect(
      getByText(/No answers have been added to this collection list/)
    ).toBeInTheDocument();
  });

  it("should render answer previews", () => {
    const { getByTestId } = renderAddItemPagePreview(props);

    expect(getByTestId("answer-wrapper-answer-1")).toBeInTheDocument();

    expect(getByTestId("answer-wrapper-answer-2")).toBeInTheDocument();
  });

  it("should render description preview when it has content and is enabled", () => {
    const { getByTestId, getByText } = renderAddItemPagePreview(props);

    expect(getByTestId("description")).toBeInTheDocument();

    expect(getByText("description")).toBeInTheDocument();
  });

  it("should render no definitions text when it doesn't have content and is enabled", () => {
    const { getByTestId, getByText } = renderAddItemPagePreview(props);

    expect(getByTestId("definition")).toBeInTheDocument();

    expect(getByText("Missing definition content")).toBeInTheDocument();
    expect(getByText("Missing definition label")).toBeInTheDocument();
  });

  it("should render no additonalInfo label text when it doesn't have content and is enabled and render additonalInfo content when it has content and is enabled", () => {
    const { getByTestId, getByText } = renderAddItemPagePreview(props);

    expect(getByTestId("additional-info")).toBeInTheDocument();

    expect(getByText("additionalInfoContent")).toBeInTheDocument();
    expect(
      getByText("Missing additional information label")
    ).toBeInTheDocument();
  });
});
