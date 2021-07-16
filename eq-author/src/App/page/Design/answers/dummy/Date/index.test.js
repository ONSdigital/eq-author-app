import React from "react";
import { render } from "tests/utils/rtl";
import Date from "./";


describe("Dummy Date Tests", () => {
   describe("Testing render conditions with various props", () => {

      it("Can render with default props", () => {
        const { getByTestId } = render(<Date  />);

        expect(getByTestId('dummy-date')).toBeInTheDocument();
      });

      it("should not render day dummy input if no day is passed in Props", () => {
        
        const { queryByText } = render(<Date showMonth showYear />);

        expect(queryByText("Day")).not.toBeInTheDocument();
        expect(queryByText("Month")).toBeInTheDocument();
        expect(queryByText("Year")).toBeInTheDocument();

      });

      it("should not render month dummy input if no month is passed in Props", () => {
        
        const { queryByText } = render(<Date showDay  showYear />);

        expect(queryByText("Day")).toBeInTheDocument();
        expect(queryByText("Month")).not.toBeInTheDocument();
        expect(queryByText("Year")).toBeInTheDocument();

      });

      it("should not render year dummy input if no year is passed in Props", () => {
        
        const { queryByText } = render(<Date showDay  showMonth />);

        expect(queryByText("Day")).toBeInTheDocument();
        expect(queryByText("Month")).toBeInTheDocument();
        expect(queryByText("Year")).not.toBeInTheDocument();

      });

      it("should render day month and year when all three props are passed in", () => {
        
        const { queryByText } = render(<Date showDay  showMonth showYear />);

        expect(queryByText("Day")).toBeInTheDocument();
        expect(queryByText("Month")).toBeInTheDocument();
        expect(queryByText("Year")).toBeInTheDocument();

      });
    });
});

