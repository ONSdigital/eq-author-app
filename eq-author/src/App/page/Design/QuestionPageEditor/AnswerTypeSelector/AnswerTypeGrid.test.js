import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import AnswerTypeGrid, { buttons } from "./AnswerTypeGrid";

describe("components/AnswerTypeGrid", () => {
  let handleClose, handleSelect;

  beforeEach(() => {
    handleClose = jest.fn();
    handleSelect = jest.fn();
  });

  it("should render", () => {
    const { getByText } = render(
      <AnswerTypeGrid
        onClose={handleClose}
        onSelect={handleSelect}
        aria-labelledby="foo"
      />
    );
    buttons.forEach(({ title }) => {
      getByText(title);
    });
  });

  describe("when answer type button clicked", () => {
    it("should invoke `onSelect` callback", () => {
      const answerType = "Radio";
      const { getByText } = render(
        <AnswerTypeGrid
          onClose={handleClose}
          onSelect={handleSelect}
          aria-labelledby="foo"
        />
      );
      const button = getByText(answerType);
      fireEvent.click(button);

      expect(handleClose).toHaveBeenCalled();
      expect(handleSelect).toHaveBeenCalledWith(answerType);
    });
  });
});
