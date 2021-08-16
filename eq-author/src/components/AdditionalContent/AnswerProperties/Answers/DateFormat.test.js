import React from "react";
import DateFormat from "./DateFormat";
import { render, fireEvent } from "tests/utils/rtl";

describe("Date Format Tests", () => {
  describe("Testing render conditions with various props", () => {
    let props;

    beforeEach(() => {
      props = {
        id: "1",
        value: "dd/mm/yyyy",
        onChange: jest.fn(),
      };
    });

    it("Can render with default props", () => {
      const { getByTestId } = render(<DateFormat {...props} />);

      expect(getByTestId("day-month-year")).toBeInTheDocument();
      expect(getByTestId("month-year")).toBeInTheDocument();
      expect(getByTestId("year")).toBeInTheDocument();
    });

    it("should handle change event for input", () => {
      const { getByTestId } = render(<DateFormat {...props} />);

      fireEvent.change(getByTestId("select"), { target: { value: "mm/yyyy" } });

      expect(props.onChange).toHaveBeenCalledWith({
        name: "1",
        value: "mm/yyyy",
      });
    });
  });
});
