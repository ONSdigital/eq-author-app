import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { ANSWER, LIST_ANSWER } from "../ContentPickerSelectv3/content-types";
import Theme from "contexts/themeContext";

import ListAnswerPicker from "./ListAnswerPicker";
import { CUSTOM } from "../../../../eq-author-api/constants/validationEntityTypes";

describe("Content Picker List Answer Picker", () => {
  let props;
  const setContentType = jest.fn();

  beforeEach(() => {
    props = {
      data: [
        {
          id: "answer1",
          type: "TextField",
          properties: {
            required: false,
          },
          label: "answer1",
          displayName: "answer1",
          secondaryLabel: null,
          qCode: null,
        },
        {
          id: "answer2",
          type: "TextField",
          properties: {
            required: false,
          },
          label: "answer2",
          displayName: "answer2",
          secondaryLabel: null,
          qCode: null,
        },
      ],
      contentType: LIST_ANSWER,
      contentTypes: [ANSWER, LIST_ANSWER],
      setContentType,
      isSelected: jest.fn(),
      onSelected: jest.fn(),
      isSectionSelected: jest.fn(),
    };
  });
  const renderListAnswerPicker = () =>
    render(
      <Theme>
        <ListAnswerPicker {...props} />
      </Theme>
    );

  it("should render the list answer radio button", () => {
    const { getByText } = renderListAnswerPicker();
    expect(getByText("List Answer")).toBeTruthy();
  });

  it("should click the Answer radio button", () => {
    const { getByTestId } = renderListAnswerPicker();
    const answerRadio = getByTestId("content-type-selector-Custom");
    fireEvent.click(answerRadio);
    expect(setContentType).toHaveBeenCalledWith(ANSWER);
  });

  it("should display the list answers", () => {
    const { getByText, getByTestId } = renderListAnswerPicker();
    const listAnswerRadio = getByTestId("content-type-selector-ListAnswer");
    fireEvent.click(listAnswerRadio);
    expect(setContentType).toHaveBeenCalledWith(CUSTOM);
    expect(getByText("answer1")).toBeTruthy();
    expect(getByText("answer2")).toBeTruthy();
  });

  it("should select the list answer on keyboard enter", () => {
    const { getByText, getByTestId } = renderListAnswerPicker();
    const listAnswerRadio = getByTestId("content-type-selector-ListAnswer");
    fireEvent.click(listAnswerRadio);
    const answer1 = getByText("answer1");
    fireEvent.keyUp(answer1, { key: "Enter", keyCode: 13 });
    expect(props.onSelected).toHaveBeenCalled();
  });

  it("should select the list answer on mouse click", () => {
    const { getByText, getByTestId } = renderListAnswerPicker();
    const listAnswerRadio = getByTestId("content-type-selector-ListAnswer");
    fireEvent.click(listAnswerRadio);
    const answer1 = getByText("answer1");
    fireEvent.click(answer1);
    expect(props.onSelected).toHaveBeenCalled();
  });
});
