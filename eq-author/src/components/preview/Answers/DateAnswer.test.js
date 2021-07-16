
import React from "react";
import { render } from "tests/utils/rtl";
import DateAnswer from "./DateAnswer";


describe("Date Answer", () => {
  let answer;

  beforeEach(() => {
    answer = {
      label: "Label",
      description: "Description",
      properties: {
        format: "dd/mm/yyyy",
      },
    };
  });
  const renderDateAnswer = () =>
    render(<DateAnswer answer={answer} />);


    describe("Testing render conditions", () => {

      it("Can render with default props", () => {
        const { getByText } = renderDateAnswer({});

        expect(getByText(answer.label)).toBeInTheDocument();
      });

      it("should not render day input if no day in format", () => {
        answer.properties.format = "mm/yyyy";
        
        const { queryByText } = renderDateAnswer({});

        expect(queryByText("Day")).not.toBeInTheDocument();
        expect(queryByText("Month")).toBeInTheDocument();
        expect(queryByText("Year")).toBeInTheDocument();

      });

      it("should not render month input if no month in format", () => {
        answer.properties.format = "dd/yyyy";
        
        const { queryByText } = renderDateAnswer({});

        expect(queryByText("Day")).toBeInTheDocument();
        expect(queryByText("Month")).not.toBeInTheDocument();
        expect(queryByText("Year")).toBeInTheDocument();

      });
    
      it("default format if its undefined", () => {
        answer.properties.format = undefined;
        
        const { queryByText } = renderDateAnswer({});

        expect(queryByText("Day")).toBeInTheDocument();
        expect(queryByText("Month")).toBeInTheDocument();
        expect(queryByText("Year")).toBeInTheDocument();

      });
      

    });
  });

