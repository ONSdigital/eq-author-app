import React from "react";

import { render, fireEvent } from "tests/utils/rtl";

import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

import NavigationSidebar from ".";
// import { isFolderTitle } from "./AddMenu";

const props = {
  questionnaire: buildQuestionnaire({ folderCount: 2 }),
  onAddQuestionPage: jest.fn(),
  onAddSection: jest.fn(),
  onAddFolder: jest.fn(),
  onAddCalculatedSummaryPage: jest.fn(),
  onAddQuestionConfirmation: jest.fn(),
  canAddQuestionConfirmation: true,
  canAddCalculatedSummaryPage: true,
  canAddQuestionPage: true,
  canAddFolder: true,
  match: { params: { entityId: "17de54db-eb71-42d5-9f4c-948b9f6dbfc5" } },
};

const renderNavigationSidebar = (props) => {
  const utils = render(<NavigationSidebar {...props} />);
  return { ...props, ...utils };
};

const defaultSetup = (changes = {}) => {
  const utils = renderNavigationSidebar({ ...props, ...changes });
  return { ...utils };
};

const addMenuOpen = () => {
  const folderTwo = "Folder 1.2";

  const utils = defaultSetup();
  fireEvent.click(utils.getByText(folderTwo));

  // const inside = utils.getByText(isFolderTitle(folderTwo));
  // const outside = utils.getByText(isFolderTitle(folderTwo, false));
  // return { folderTwo, inside, outside, ...utils };
  return { folderTwo, ...utils };
};

describe("Navigation sidebar", () => {
  it("Can render with an assortment of questions and folders", () => {
    const { getByTestId } = renderNavigationSidebar();
    expect(getByTestId("side-nav")).toBeTruthy();
  });

  describe("Add menu", () => {
    it("should display 'Inside <folder title> and Outside <folder title>", () => {
      const { getByText } = addMenuOpen();

      expect(getByText(true)).toBeTruthy();
      // expect(getByText(outside)).toBeVisible();
    });

    // it("should display 'Inside <folder title> and Outside <folder title>", () => {
    //   const { getByText, inside, outside } = addMenuOpen();

    //   expect(getByText(inside)).toBeVisible();
    //   expect(getByText(outside)).toBeVisible();
    // });
    // it("should add a question inside folder when clicking Inside", () => {
    //   const { getByText, inside, onAddQuestionPage } = addMenuOpen();

    //   expect(getByText("Untitled question")).toBeNull();
    //   fireEvent.click(inside);

    //   // verify the position of the folder
    //   expect(onAddQuestionPage).toHaveBeenCalledWith();
    //   expect(getByText("Untitled question")).toBeVisible();
    // });

    // it("should add a question directly after the folder when clicking Outside", () => {
    //   const { getByText, outside, onAddQuestionPage } = addMenuOpen();

    //   expect(getByText("Untitled question")).toBeNull();
    //   fireEvent.click(outside);

    //   // verify the position of the folder
    //   expect(onAddQuestionPage).toHaveBeenCalledWith();
    //   expect(getByText("Untitled question")).toBeVisible();
    // });
  });
});
