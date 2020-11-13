import React from "react";
import { shallow } from "enzyme";

import NoRouting from "./NoRouting";
import { render, fireEvent, screen } from "tests/utils/rtl";
import QuestionnaireContext from "components/QuestionnaireContext";

describe("components/NoRouting", () => {
  const disabledTitle = "Routing is not available for this quesiton";
  const disabledParagraph =
    "You can't route on the last question in a questionnaire.";
  const enabledTitle = "No routing rules exist for this question";
  const enabledParagraph =
    "Users completing this question will be taken to the next page.";

  it("should render with button enabled", () => {
    const { queryByText } = render(
      <NoRouting onAddRouting={jest.fn()} title="Test">
        Ullamcorper Venenatis Fringilla
      </NoRouting>
    );

    expect(queryByText(enabledTitle)).toBeTruthy();
    expect(queryByText(enabledParagraph)).toBeTruthy();
    expect(queryByText(disabledTitle)).toBeFalsy();
    expect(queryByText(disabledParagraph)).toBeFalsy();

    expect(screen.getByTestId("btn-add-routing")).not.toHaveStyle(
      `pointer-events: none; 
       opacity: 0.6;`
    );
  });

  it("should render with button disabled", () => {
    let props, questionnaire, page;

    questionnaire = {
      sections: [
        {
          id: 1,
          title: "Section-1",
          position: 0,
          pages: [
            {
              id: "page-1",
              pageType: "QuestionPage",
              title: "<p>Questions 1</p>",
              position: 0,
              description: "",
              answers: [
                {
                  id: "ans-p1-1",
                  description: "",
                  guidance: "",
                  label: "num1",
                  questionPageId: "qp-1",
                  secondaryLabel: null,
                },
              ],
            },
            {
              id: "page-2",
              pageType: "QuestionPage",
              title: "<p>Questions 2</p>",
              position: 1,
              description: "",
              answers: [
                {
                  id: "ans-p2-1",
                  description: "",
                  guidance: "",
                  label: "num2",
                  questionPageId: "qp-2",

                  secondaryLabel: null,
                },
              ],
            },
          ],
        },
        {
          id: 2,
          title: "Section-2",
          position: 1,
          pages: [
            {
              id: "page-3",
              pageType: "QuestionPage",
              title: "<p>Questions 3</p>",
              position: 0,
              description: "",
              answers: [
                {
                  id: "ans-p3-1",
                  description: "",
                  guidance: "",
                  label: "num3",
                  questionPageId: "qp-3",
                  secondaryLabel: null,
                },
              ],
            },
            {
              id: "page-4",
              pageType: "QuestionPage",
              title: "<p>Questions 4</p>",
              position: 1,
              description: "",
              answers: [
                {
                  id: "ans-p4-1",
                  description: "",
                  guidance: "",
                  label: "num4",
                  questionPageId: "qp-4",
                  secondaryLabel: null,
                },
              ],
            },
          ],
        },
      ],
    };

    page = {
      id: "page-4",
      pageType: "QuestionPage",
      title: "<p>Questions 4</p>",
      position: 1,
      description: "",
      answers: [
        {
          id: "ans-p4-1",
          description: "",
          guidance: "",
          label: "num4",
          questionPageId: "qp-4",
          secondaryLabel: null,
        },
      ],
    };

    props = {
      questionnaire,
      page,
    };

    const { queryByText } = render(
      <QuestionnaireContext.Provider value={{ props }}>
        <NoRouting onAddRouting={jest.fn()} title="Test" isLastPage>
          Ullamcorper Venenatis Fringilla
        </NoRouting>
      </QuestionnaireContext.Provider>
    );

    expect(queryByText(disabledTitle)).toBeTruthy();
    expect(queryByText(disabledParagraph)).toBeTruthy();
    expect(queryByText(enabledTitle)).toBeFalsy();
    expect(queryByText(enabledParagraph)).toBeFalsy();

    expect(screen.getByTestId("btn-add-routing")).toHaveStyle(
      `pointer-events: none; 
       opacity: 0.6;`
    );
  });

  it("should call onAddRouting when button clicked", () => {
    const onAddRouting = jest.fn();
    const { getByTestId } = render(
      <NoRouting onAddRouting={onAddRouting} title="Test">
        Ullamcorper Venenatis Fringilla
      </NoRouting>
    );
    const button = getByTestId("btn-add-routing");
    fireEvent.click(button);
    expect(onAddRouting).toHaveBeenCalledTimes(1);
  });
});
