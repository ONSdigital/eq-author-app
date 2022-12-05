import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { useMutation } from "@apollo/react-hooks";

import IntroductionHeader from "./IntroductionHeader";

jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(() => [() => null]),
}));

describe("IntroductionHeader", () => {
  const renderIntroductionHeader = (props) => {
    return render(<IntroductionHeader {...props} />);
  };

  it("should render", () => {
    const { getByTestId } = renderIntroductionHeader();
    expect(
      getByTestId("introduction-toolbar-button-container")
    ).toBeInTheDocument();
  });

  describe("Delete introduction page", () => {
    it("should display delete modal", () => {
      const { getByTestId, queryByTestId } = renderIntroductionHeader();

      expect(queryByTestId("modal")).not.toBeInTheDocument();

      fireEvent.click(getByTestId("btn-delete-introduction"));

      expect(queryByTestId("modal")).toBeInTheDocument();
    });

    it("should close delete modal", () => {
      const { getByTestId, queryByTestId } = renderIntroductionHeader();

      fireEvent.click(getByTestId("btn-delete-introduction"));

      expect(queryByTestId("modal")).toBeInTheDocument();

      fireEvent.click(getByTestId("btn-modal-negative"));

      expect(queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("should delete introduction page", () => {
      const { getByTestId } = renderIntroductionHeader();
      const deleteIntroduction = jest.fn();
      useMutation.mockImplementation(jest.fn(() => [deleteIntroduction]));

      fireEvent.click(getByTestId("btn-delete-introduction"));
      fireEvent.click(getByTestId("btn-modal-positive"));

      expect(deleteIntroduction).toHaveBeenCalledTimes(1);
    });
  });
});
