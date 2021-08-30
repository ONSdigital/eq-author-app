import React from "react";
import DateProperties from "./DateProperties";
import { render, fireEvent } from "tests/utils/rtl";

describe("Date Format Tests", () => {
  describe("Testing render conditions with various props", () => {
    let props;

    beforeEach(() => {
      props = {
        answer: {
          id: "1",
          type: "Date",
          properties: {
            required: true,
          },
          validationErrorInfo: {
            totalCount: 0,
            errors: [],
            id: "1",
          },
        },
        updateAnswer: jest.fn(),
      };
    });

    it("Can render with default props", () => {
      const { getByTestId } = render(<DateProperties {...props} />);

      expect(getByTestId("day-month-year")).toBeInTheDocument();
      expect(getByTestId("month-year")).toBeInTheDocument();
      expect(getByTestId("year")).toBeInTheDocument();
    });

    it("should handle change event for input", () => {
      const { getByTestId } = render(<DateProperties {...props} />);

      fireEvent.change(getByTestId("select"), { target: { value: "mm/yyyy" } });

      expect(props.updateAnswer).toHaveBeenCalledTimes(1);
    });
  });
});
