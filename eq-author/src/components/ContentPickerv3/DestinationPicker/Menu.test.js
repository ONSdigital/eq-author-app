import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import Menu, { tabTitles } from "./Menu";

import { NextPage, EndOfCurrentSection } from "constants/destinations";

import { useQuestionnaire } from "components/QuestionnaireContext";

jest.mock("components/QuestionnaireContext", () => ({
  useQuestionnaire: jest.fn(),
}));

let questionnaire;

const props = {
  data: {
    logicalDestinations: {
      [NextPage]: {
        id: NextPage,
        displayName: "Next Page",
        logicalDestination: NextPage,
      },
      [EndOfCurrentSection]: {
        id: EndOfCurrentSection,
        logicalDestination: EndOfCurrentSection,
        displayName: "End of current section",
      },
    },
    pages: [
      {
        id: "1",
        displayName: "Question one",
        section: [
          {
            id: "section-1",
            displayName: "Section one",
          },
        ],
      },
      {
        id: "2",
        displayName: "Question two",
        section: [
          {
            id: "section-1",
            displayName: "Section one",
          },
        ],
      },
      {
        id: "3",
        displayName: "Question three",
        section: [
          {
            id: "section-1",
            displayName: "Section one",
          },
        ],
      },
      {
        id: "4",
        displayName: "Question four",
        section: [
          {
            id: "section-1",
            displayName: "Section one",
          },
        ],
      },
    ],
  },
  isSelected: jest.fn(),
};

function setup({ data, isSelected, ...extra }) {
  const onSelected = jest.fn();
  const utils = render(
    <Menu
      data={data}
      onSelected={onSelected}
      isSelected={isSelected}
      {...extra}
    />
  );

  const keyPress = (name, { key, code }) =>
    fireEvent.keyUp(utils.getByText(name), {
      key,
      code,
    });

  const keyPressId = (id, { key, code }) =>
    fireEvent.keyUp(utils.getByTestId(id), {
      key,
      code,
    });

  const click = (name) => fireEvent.click(utils.getByText(name));

  return {
    ...utils,
    keyPress,
    keyPressId,
    click,
    onSelected,
  };
}

function defaultSetup() {
  const utils = setup(props);
  return { ...utils };
}

describe("Destination Picker Menu", () => {
  describe("Hub is disabled", () => {
    beforeEach(() => {
      questionnaire = { hub: false };
      useQuestionnaire.mockImplementation(() => ({ questionnaire }));
    });

    it("should default to current section tab by checking if a question page in current section is visible", () => {
      const { getByText } = defaultSetup();
      expect(getByText("Question one")).toBeVisible();
    });

    it("should show active for current tab", () => {
      const { getByText } = defaultSetup();
      expect(getByText(tabTitles.current)).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });

    it("should display question pages in 'Current section'", () => {
      const { getByText } = defaultSetup();
      expect(getByText(tabTitles.current)).toHaveAttribute(
        "aria-selected",
        "true"
      );
      expect(getByText("Question one")).toBeVisible();
      expect(getByText("Question two")).toBeVisible();
      expect(getByText("Question three")).toBeVisible();
      expect(getByText("Question four")).toBeVisible();
    });

    it("should display 'Other destinations' options", () => {
      const { getByText, click } = defaultSetup();
      click(tabTitles.other);
      expect(getByText(tabTitles.other)).toHaveAttribute(
        "aria-selected",
        "true"
      );
      expect(getByText("Next Page")).toBeVisible();
      expect(getByText("End of current section")).toBeVisible();
    });

    it("should be able to change destination tabs with Space or enter", () => {
      const { getByText, keyPress } = defaultSetup();

      expect(getByText(tabTitles.current)).toHaveAttribute(
        "aria-selected",
        "true"
      );

      // changes with Space
      keyPress(tabTitles.other, { key: " ", code: "Space" });
      expect(getByText(tabTitles.other)).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });

    it("should be able to change destination tabs with click", () => {
      const { getByText, click } = defaultSetup();

      click(tabTitles.current);
      expect(getByText(tabTitles.current)).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });

    it("should be able to select destination with Enter", () => {
      const { onSelected, keyPress } = defaultSetup();

      keyPress("Question two", { key: "Enter", code: "Enter" });
      expect(onSelected).toHaveBeenCalledTimes(1);
      expect(onSelected).toHaveBeenCalledWith(props.data.pages[1]);
    });

    it("should be able to select destination with Space", () => {
      const { onSelected, keyPress } = defaultSetup();

      keyPress("Question three", { key: " ", code: "Space" });
      expect(onSelected).toHaveBeenCalledTimes(1);
      expect(onSelected).toHaveBeenCalledWith(props.data.pages[2]);
    });

    it("should be able to select destination with click", () => {
      const { onSelected, click } = defaultSetup();

      click("Question two");
      expect(onSelected).toHaveBeenCalledTimes(1);
      expect(onSelected).toHaveBeenCalledWith(props.data.pages[1]);
    });

    it("should return last question page if clicking 'End of current section'", () => {
      const { onSelected, click } = defaultSetup();
      const LogicalDestinationArray = props.data.logicalDestinations;

      click("Other destinations");
      click("End of current section");
      expect(onSelected).toHaveBeenCalledTimes(1);
      expect(onSelected).toHaveBeenCalledWith({
        displayName: "End of current section",
        id: LogicalDestinationArray[EndOfCurrentSection].id,
        logicalDestination:
          LogicalDestinationArray[EndOfCurrentSection].logicalDestination,
      });
    });
  });

  describe("Hub is enabled", () => {
    beforeEach(() => {
      questionnaire = { hub: true };
      useQuestionnaire.mockImplementation(() => ({ questionnaire }));
    });

    it("should display 'Current section' and 'Other destinations' when hub is enabled", () => {
      const { queryByText } = defaultSetup();
      expect(queryByText(tabTitles.current)).toBeTruthy();
      expect(queryByText(tabTitles.other)).toBeTruthy();
    });

    it("should not display 'End of questionnaire' when hub is enabled", () => {
      const { click, queryByText } = defaultSetup();
      click(tabTitles.other);
      expect(queryByText("End of questionnaire")).toBeFalsy();
    });
  });
});
