import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import config from "config";

import AnswerTypeGrid, { buttons } from "./AnswerTypeGrid";

describe("components/AnswerTypeGrid", () => {
  let handleClose, handleSelect;

  const renderAnswerTypeGrid = (props) => {
    return render(
      <AnswerTypeGrid
        onClose={handleClose}
        onSelect={handleSelect}
        aria-labelledby="foo"
        {...props}
      />
    );
  };

  beforeEach(() => {
    handleClose = jest.fn();
    handleSelect = jest.fn();
  });

  it("should render", () => {
    const { getByText } = renderAnswerTypeGrid();
    buttons.forEach(({ title }) => {
      getByText(title);
    });
  });

  describe("when answer type button clicked", () => {
    it("should invoke `onSelect` callback", () => {
      const answerType = "Radio";
      const { getByText } = renderAnswerTypeGrid({ radioEnabled: true });
      const button = getByText(answerType);
      fireEvent.click(button);

      expect(handleClose).toHaveBeenCalled();
      expect(handleSelect).toHaveBeenCalledWith(answerType);
    });
  });

  describe("mutually exclusive", () => {
    it("should not display mutually exclusive on AWS", () => {
      const { queryByText } = render(
        <AnswerTypeGrid
          onClose={handleClose}
          onSelect={handleSelect}
          aria-labelledby="foo"
          radioEnabled
          mutuallyExclusiveEnabled
        />
      );

      expect(queryByText(/OR answer/)).not.toBeInTheDocument();
    });

    it("should display mutually exclusive on GCP", () => {
      process.env.FEATURE_FLAGS = "mutuallyExclusiveAnswer";
      console.log(
        "config.REACT_APP_FEATURE_FLAGS",
        config.REACT_APP_FEATURE_FLAGS
      );

      const { queryByText } = renderAnswerTypeGrid();

      expect(queryByText(/OR answer/)).toBeInTheDocument();
    });
  });
});
