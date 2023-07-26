import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import { useQuery, useMutation } from "@apollo/react-hooks";

import AddItemPageEditor from ".";

import suppressConsoleMessage from "tests/utils/supressConsol";

/*
 * @description Suppresses specific messages from being logged in the Console.
 */
suppressConsoleMessage("componentWillMount has been renamed", "warn");
suppressConsoleMessage("componentWillReceiveProps has been renamed", "warn");

const mockUseMutation = jest.fn();

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual("@apollo/react-hooks"),
  useMutation: () => [mockUseMutation],
  useQuery: jest.fn(),
}));

const renderAddItemPageEditor = (props) => {
  return render(<AddItemPageEditor {...props} />);
};

describe("ListCollectorPageEditors/AddItemPageEditor", () => {
  let props, mockUseMutation;

  beforeEach(() => {
    // mockUseMutation = jest.fn();
    // useMutation.mockImplementation(jest.fn(() => [mockUseMutation]));

    useQuery.mockImplementation(() => ({
      loading: false,
      error: false,
      data: {
        page: {
          id: "page-1",
          alias: "P1",
          title: "Page 1",
          pageDescription: "Page 1 description",
          displayName: "P1",
          position: 0,
          folder: { id: "folder-1" },
          section: { id: "section-1" },
          validationErrorInfo: { errors: [] },
        },
      },
    }));

    props = {
      page: {
        id: "page-1",
        alias: "P1",
        title: "Page 1",
        pageDescription: "Page 1 description",
        displayName: "P1",
        position: 0,
        folder: { id: "folder-1" },
        section: { id: "section-1" },
        validationErrorInfo: { errors: [] },
      },
    };
  });

  it("should render add item page editor", () => {
    const { getByTestId } = renderAddItemPageEditor(props);

    expect(
      getByTestId("list-collector-add-item-page-editor")
    ).toBeInTheDocument();
  });

  //   it("should update page alias", () => {
  //     const { getByTestId } = renderAddItemPageEditor(props);

  //     const aliasInput = getByTestId("alias");

  //     expect(mockUseMutation).toHaveBeenCalledTimes(0);

  //     fireEvent.update(aliasInput, { target: { value: "New alias" } });

  //     expect(mockUseMutation).toHaveBeenCalledTimes(1);
  //   });
});
