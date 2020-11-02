import React from "react";
import { render, fireEvent, screen } from "tests/utils/rtl";

import NoSkipConditions from "./NoSkipConditions";

describe("components/NoSkipConditions", () => {
  const disabledTitle = "Skip logic not available for this question";
  const disabledParagraph =
    "You can't add skip logic to the first question in a questionnaire.";
  const enabledTitle = "No skip conditions exist for this question";
  const enabledParagraph =
    "All users will see this question if no skip logic is added.";
  
  it("should render rtl", () => {
    const { debug, queryByText, getByTestId } = render(
      <NoSkipConditions
        onAddSkipCondtions={jest.fn()}
        isFirstQuestion={true}
      ></NoSkipConditions>
    );
    // console.log(debug());
    expect(queryByText(disabledTitle)).toBeTruthy();
    expect(queryByText(disabledParagraph)).toBeTruthy();
    expect(queryByText(enabledTitle)).toBeFalsy();
    expect(queryByText(enabledParagraph)).toBeFalsy();

    // const button = screen.queryByTestId("btn-add-skip-condition");
    // console.log(button);
    // expect(button).toHaveStyleRule(
    //   "pointer-events: literally-anything;"
    // );

    // expect(screen.getByTestId("btn-add-skip-condition")).toHaveStyleRule(
    //   "margin: 2em auto 1em;"
    // );
  });


  it("should render rtl", () => {
    const { debug, queryByText } = render(
      <NoSkipConditions
        onAddSkipCondtions={jest.fn()}
        isFirstQuestion={false}
      ></NoSkipConditions>
    );
    console.log(debug());
    expect(queryByText(enabledTitle)).toBeTruthy();
    expect(queryByText(enabledParagraph)).toBeTruthy();
    expect(queryByText(disabledTitle)).toBeFalsy();
    expect(queryByText(disabledParagraph)).toBeFalsy();
  });

  it("should call onAddSkipConditions when button clicked", () => {
    const onAddSkipCondtions = jest.fn();
    const { getByTestId } = render(
      <NoSkipConditions
        onAddSkipCondtions={onAddSkipCondtions}
        isFirstQuestion={true}
      ></NoSkipConditions>
    );
    // wrapper.find("[data-test='btn-add-skip-condition']").simulate("click");
    const button = getByTestId("btn-add-skip-condition");
    console.log(button);
    fireEvent.click(button);
    expect(onAddSkipCondtions).toHaveBeenCalledTimes(1);
  });

  // expect(screen.getByTestId("action-btns")).toHaveStyleRule("display: flex;");

  // NEW TESTS

  // questionnaire = {
  //   sections: [
  //     {
  //       pages: [
  //         {
  //           id: "page-1",
  //           pageType: "QuestionPage",
  //           title: "<p>Questions 1</p>",
  //           description: "",
  //           position: 0,
  //           section: {
  //             position: 0,
  //           },
  //           answers: [
  //             {
  //               id: "ans-p1",
  //               description: "",
  //               guidance: "",
  //               label: "num1",
  //               type: NUMBER,
  //               questionPageId: "qp-1",
  //             },
  //           ],
  //         },
  //         {
  //           id: "page-2",
  //           pageType: "QuestionPage",
  //           title: "<p>Questions 2</p>",
  //           description: "",
  //           postion: 1,
  //           section: {
  //             position: 0,
  //           },
  //           answers: [
  //             {
  //               id: "ans-p2",
  //               description: "",
  //               guidance: "",
  //               label: "num2",
  //               type: NUMBER,
  //               questionPageId: "qp-2",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // };
  // props = {
  //   data: {
  //     questionnaire,
  //   },
  // };
});
