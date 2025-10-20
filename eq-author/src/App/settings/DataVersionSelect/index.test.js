import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { useMutation } from "@apollo/react-hooks";

import DataVersionSelect from ".";

jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(() => [() => null]),
}));

describe("DataVersionSelect", () => {
  let props;
  const updateQuestionnaire = jest.fn();

  beforeEach(() => {
    props = {
      questionnaireId: "questionnaire-1",
      selectedDataVersion: "1",
      allowableDataVersions: ["1", "3"],
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderDataVersionSelect = (props) => {
    return render(<DataVersionSelect {...props} />);
  };

  it("should render", () => {
    const { getByText } = renderDataVersionSelect(props);
    expect(getByText("Data version 1")).toBeTruthy();
    expect(getByText("Data version 3")).toBeTruthy();
  });

  it("should update questionnaire data version", () => {
    useMutation.mockImplementation(jest.fn(() => [updateQuestionnaire]));
    const { getByTestId } = renderDataVersionSelect(props);

    fireEvent.click(getByTestId("data-version-input-3"));
    expect(updateQuestionnaire).toHaveBeenCalledWith({
      variables: {
        input: { id: "questionnaire-1", dataVersion: "3" },
      },
    });
  });

  it("should disable data version option if not in allowable data versions", () => {
    props.selectedDataVersion = "3";
    props.allowableDataVersions = ["3"];
    const { getByTestId } = renderDataVersionSelect(props);

    expect(getByTestId("data-version-input-1")).toBeDisabled();
    expect(getByTestId("data-version-input-3")).not.toBeDisabled();
  });
});
