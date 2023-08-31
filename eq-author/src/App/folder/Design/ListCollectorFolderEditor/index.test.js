import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { buildCollectionListsPath } from "utils/UrlUtils";
import ListCollectorFolderEditor from ".";

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual("@apollo/react-hooks"),
  useMutation: jest.fn(() => [() => null]),
  useQuery: jest.fn(),
}));

const renderListCollectorFolderEditor = (props) => {
  return render(<ListCollectorFolderEditor {...props} />);
};

describe("ListCollectorFolderEditor", () => {
  let props, questionnaireId, history, mockUseMutation;
  beforeEach(() => {
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
              ],
            },
          ],
        },
      },
    }));

    mockUseMutation = jest.fn();
    useMutation.mockImplementation(jest.fn(() => [mockUseMutation]));

    questionnaireId = "questionnaire-1";
    history = { push: jest.fn() };
    props = {
      questionnaireId,
      folder: {
        id: "folder-1",
        listId: "list-1",
        title: "List collector folder",
        validationErrorInfo: { errors: [] },
      },
      history,
    };
  });

  it("should render loading page", () => {
    useQuery.mockImplementationOnce(() => ({
      loading: true,
    }));

    const { getByTestId } = renderListCollectorFolderEditor(props);

    expect(getByTestId("loading")).toBeInTheDocument();
  });

  it("should render error page", () => {
    useQuery.mockImplementationOnce(() => ({
      error: true,
    }));

    const { getByTestId } = renderListCollectorFolderEditor(props);

    expect(getByTestId("error")).toBeInTheDocument();
  });

  it("should render list collector folder", () => {
    const { getByTestId } = renderListCollectorFolderEditor(props);

    expect(getByTestId("list-collector-folder-editor")).toBeInTheDocument();
  });

  it("should update folder title", () => {
    const { getByTestId } = renderListCollectorFolderEditor(props);
    const folderTitleInput = getByTestId("list-collector-folder-title-input");

    expect(mockUseMutation).toHaveBeenCalledTimes(0);

    fireEvent.change(folderTitleInput, {
      target: { value: "New folder title" },
    });

    fireEvent.blur(folderTitleInput);

    expect(mockUseMutation).toHaveBeenCalledTimes(1);
    expect(mockUseMutation).toHaveBeenCalledWith({
      variables: { input: { folderId: "folder-1", title: "New folder title" } },
    });
  });

  it("should display relevant validation error message", () => {
    const validationErrorInfo = {
      id: "validation-error-info-1",
      totalCount: 1,
      errors: [
        {
          errorCode: "ERR_VALID_REQUIRED",
          field: "title",
          id: "error-1",
          type: "folders",
        },
      ],
    };

    props.folder.validationErrorInfo = validationErrorInfo;

    const { getByText } = renderListCollectorFolderEditor(props);

    expect(getByText(/Enter a list collector title/)).toBeInTheDocument();
  });

  it("should update selected list", () => {
    const { getByTestId } = renderListCollectorFolderEditor(props);

    const listSelect = getByTestId("list-select");

    expect(mockUseMutation).toHaveBeenCalledTimes(0);

    fireEvent.change(listSelect, {
      target: {
        value: "list-1",
      },
    });

    expect(mockUseMutation).toHaveBeenCalledTimes(1);
    expect(mockUseMutation).toHaveBeenCalledWith({
      variables: { input: { folderId: "folder-1", listId: "list-1" } },
    });
  });

  it("should handle adding new list", () => {
    const { getByTestId } = renderListCollectorFolderEditor(props);

    const listSelect = getByTestId("list-select");

    fireEvent.change(listSelect, {
      target: {
        value: "newList",
      },
    });

    expect(mockUseMutation).toHaveBeenCalledTimes(0);
    expect(history.push).toHaveBeenCalledTimes(1);
    expect(history.push).toHaveBeenCalledWith(
      buildCollectionListsPath({ questionnaireId })
    );
  });
});
