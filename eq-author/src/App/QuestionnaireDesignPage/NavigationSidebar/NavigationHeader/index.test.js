import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { useParams } from "react-router-dom";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

import QuestionnaireContext from "components/QuestionnaireContext";

import { UnwrappedNavigationHeader as NavigationHeader } from "./index";

jest.mock("components/NavigationCallbacks", () => ({
  useNavigationCallbacks: () => ({
    onAddQuestionPage: () => jest.fn(),
    onAddFolder: jest.fn(),
    onAddCalculatedSummaryPage: jest.fn(),
    onAddListCollectorFolder: jest.fn(),
  }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

useParams.mockImplementation(() => ({
  entityName: "section",
  entityId: "1.1.1",
}));

function defaultSetup(changes) {
  const onCreateQuestionConfirmation = jest.fn();
  const onAddSection = jest.fn();
  const onAddIntroductionPage = jest.fn();
  const props = {
    onCreateQuestionConfirmation,
    onAddSection,
    onAddIntroductionPage,
    ...changes,
  };
  const questionnaire = buildQuestionnaire({ folderCount: 2 });
  const utils = render(
    <QuestionnaireContext.Provider value={{ questionnaire }}>
      <NavigationHeader {...props} />
    </QuestionnaireContext.Provider>
  );

  return {
    ...utils,
    onCreateQuestionConfirmation,
    onAddSection,
    onAddIntroductionPage,
  };
}

function openSetup() {
  const utils = defaultSetup();
  const menuButton = utils.getByTestId("btn-add-menu");
  fireEvent.click(menuButton);
  const section = utils.getByTestId("btn-add-section");
  const introduction = utils.getByTestId("btn-add-introduction");
  const question = utils.getByTestId("btn-add-question-page");
  const folder = utils.getByTestId("btn-add-folder");
  const calculated = utils.getByTestId("btn-add-calculated-summary");
  const confirmation = utils.getByTestId("btn-add-question-confirmation");
  const listCollectorFolder = utils.getByTestId(
    "btn-add-list-collector-folder"
  );

  return {
    ...utils,
    menuButton,
    section,
    introduction,
    question,
    folder,
    calculated,
    confirmation,
    listCollectorFolder,
  };
}

describe("NavigationHeader", () => {
  it("should render", () => {
    const { getByTestId } = defaultSetup();
    expect(getByTestId("btn-add-menu")).toBeVisible();
  });

  it("should open up menu", () => {
    const { queryByTestId } = defaultSetup();
    expect(queryByTestId("addmenu-window")).toBeNull();
    fireEvent.click(queryByTestId("btn-add-menu"));
    expect(queryByTestId("addmenu-window")).toBeVisible();
  });

  describe("when entityName is Section", () => {
    it("should close after adding a section", () => {
      const { menuButton, onAddSection, section } = openSetup();
      fireEvent.click(section);
      expect(onAddSection).toHaveBeenCalledTimes(1);
      expect(menuButton.getAttribute("aria-expanded")).toEqual("false");
    });

    it("should close after adding a folder", () => {
      const { menuButton, folder } = openSetup();
      fireEvent.click(folder);
      expect(menuButton.getAttribute("aria-expanded")).toEqual("false");
    });

    it("should close after adding a list collector folder", () => {
      const { menuButton, listCollectorFolder } = openSetup();
      fireEvent.click(listCollectorFolder);
      expect(menuButton.getAttribute("aria-expanded")).toEqual("false");
    });

    it("should close after firing question page", () => {
      const { menuButton, question } = openSetup();
      fireEvent.click(question);
      expect(menuButton.getAttribute("aria-expanded")).toEqual("false");
    });

    it("should close after firing a calculated summary", () => {
      const { menuButton, calculated } = openSetup();
      fireEvent.click(calculated);
      expect(menuButton.getAttribute("aria-expanded")).toEqual("false");
    });

    it("should be disabled for confirmation question", () => {
      const { confirmation } = openSetup();
      fireEvent.click(confirmation);
      expect(confirmation).toBeDisabled();
    });

    it("should close after adding introduction page", () => {
      const { menuButton, introduction, onAddIntroductionPage } = openSetup();
      fireEvent.click(introduction);
      expect(onAddIntroductionPage).toHaveBeenCalledTimes(1);
      expect(menuButton.getAttribute("aria-expanded")).toEqual("false");
    });
  });

  describe("when entityName is Page", () => {
    it("should be able to add confirmation question", () => {
      useParams.mockImplementation(() => ({
        entityName: "page",
        entityId: "1.1.1",
      }));
      const { menuButton, confirmation, onCreateQuestionConfirmation } =
        openSetup();
      fireEvent.click(confirmation);
      expect(onCreateQuestionConfirmation).toHaveBeenCalledTimes(1);
      expect(menuButton.getAttribute("aria-expanded")).toEqual("false");
    });

    describe("when entityName is Folder", () => {
      it("should generate folder title when folder", () => {
        useParams.mockImplementation(() => ({
          entityName: "folder",
          entityId: "1.2",
        }));
        const { getByText } = openSetup();
        expect(getByText(/Inside Folder 1.2/)).toBeVisible();
        expect(getByText(/Outside Folder 1.2/)).toBeVisible();
      });

      it("should disable confirmation question", () => {
        useParams.mockImplementation(() => ({
          entityName: "folder",
          entityId: "1.2",
        }));
        const { confirmation } = openSetup();
        expect(confirmation).toBeDisabled();
      });
    });
  });
});
