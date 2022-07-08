import React from "react";
import {
  NUMBER,
  CURRENCY,
  RADIO,
  MUTUALLY_EXCLUSIVE,
} from "constants/answer-types";

import {
  render,
  fireEvent,
  waitForElementToBeRemoved,
  screen,
} from "tests/utils/rtl";

import AnswerTypeSelector from ".";

describe("Answer Type Selector", () => {
  let props;
  beforeEach(() => {
    props = {
      onSelect: jest.fn(),
      page: {
        answers: [],
      },
    };
  });

  it("shouldn't render content when closed", () => {
    const { queryByText } = render(<AnswerTypeSelector {...props} />);
    expect(queryByText("Number")).toBeFalsy();
  });

  it("should say to add 'another' answer if > 0 answers currently", () => {
    const { getByText } = render(
      <AnswerTypeSelector {...props} page={{ answers: [{}] }} />
    );
    expect(getByText(/add another answer/i)).toBeTruthy();
  });

  it("should say to add 'an' answer if the page has no answers", () => {
    const { getByText } = render(
      <AnswerTypeSelector {...props} page={{ answers: [] }} />
    );
    expect(getByText(/add an answer/i)).toBeTruthy();
  });

  it("should render content when open", () => {
    const { getByText } = render(<AnswerTypeSelector {...props} />);
    fireEvent.click(getByText(/add an answer/i));

    expect(getByText("Number")).toBeTruthy();
  });

  it("select trigger onSelect and close the modal when an answer is selected", async () => {
    const { getByText, queryByText } = render(
      <AnswerTypeSelector {...props} />
    );
    fireEvent.click(getByText(/add an answer/i));
    fireEvent.click(getByText("Number"));
    expect(props.onSelect).toHaveBeenCalledWith("Number");
    await waitForElementToBeRemoved(() => queryByText("Number"));
  });

  it("There is a Date range selected and then unable to select any others", async () => {
    props.page.answers[0] = { type: "DateRange" };
    render(<AnswerTypeSelector {...props} />);
    expect(screen.getByTestId("btn-add-answer")).toHaveAttribute("disabled");
  });

  it("If options.mutuallyExclusive = true then unable to select any others", async () => {
    props = {
      onSelect: jest.fn(),
      page: {
        answers: [
          {
            options: [
              {
                mutuallyExclusive: true,
              },
            ],
          },
        ],
      },
    };
    render(<AnswerTypeSelector {...props} />);
    expect(screen.getByTestId("btn-add-answer")).toHaveAttribute("disabled");
  });

  it("Select Number type then unable to select Date Range", async () => {
    props.page.answers[0] = { type: "Number" };
    render(<AnswerTypeSelector {...props} />);
    fireEvent.click(screen.getByTestId("btn-add-answer"));
    expect(screen.getByTestId("btn-answer-type-daterange")).toHaveAttribute(
      "disabled"
    );
  });

  it("should show an error when the answers field has a validation error", () => {
    props.page = {
      ...props.page,
      validationErrorInfo: {
        errors: [
          {
            errorCode: "ERR_NO_ANSWERS",
            field: "answers",
            id: "pages-1468e75f-1c32-45a0-91f2-521c5ab86c76-answers",
            type: "pages",
          },
        ],
      },
    };
    const { getByText } = render(<AnswerTypeSelector {...props} />);

    expect(getByText("Answer required")).toBeTruthy();
  });

  describe("Mutually exclusive", () => {
    it("should not disable mutually exclusive if there are other answers", () => {
      props.page.answers = [{ type: NUMBER }, { type: CURRENCY }];
      const { getByText, getByTestId } = render(
        <AnswerTypeSelector {...props} />
      );
      fireEvent.click(getByText(/Add another answer/));
      expect(
        getByTestId("btn-answer-type-mutuallyexclusive")
      ).not.toHaveAttribute("disabled");
    });

    it("should disable mutually exclusive if there are no other answers", () => {
      const { getByText, getByTestId } = render(
        <AnswerTypeSelector {...props} />
      );
      fireEvent.click(getByText(/Add an answer/));
      expect(getByTestId("btn-answer-type-mutuallyexclusive")).toHaveAttribute(
        "disabled"
      );
    });

    it("should disable mutually exclusive if there is a radio answer", () => {
      props.page.answers[0] = { type: RADIO };
      const { getByText, getByTestId } = render(
        <AnswerTypeSelector {...props} />
      );
      fireEvent.click(getByText(/Add another answer/));
      expect(getByTestId("btn-answer-type-mutuallyexclusive")).toHaveAttribute(
        "disabled"
      );
    });

    it("should disable radio if there is a mutually exclusive answer", () => {
      props.page.answers = [{ type: NUMBER }, { type: MUTUALLY_EXCLUSIVE }];
      const { getByText, getByTestId } = render(
        <AnswerTypeSelector {...props} />
      );
      fireEvent.click(getByText(/Add another answer/));
      expect(getByTestId("btn-answer-type-radio")).toHaveAttribute("disabled");
    });

    it("should disable mutually exclusive if there is already a mutually exclusive answer", () => {
      props.page.answers = [{ type: NUMBER }, { type: MUTUALLY_EXCLUSIVE }];
      const { getByText, getByTestId } = render(
        <AnswerTypeSelector {...props} />
      );
      fireEvent.click(getByText(/Add another answer/));
      expect(getByTestId("btn-answer-type-mutuallyexclusive")).toHaveAttribute(
        "disabled"
      );
    });
  });
});
