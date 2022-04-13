import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import Menu, { tabTitles } from "./Menu";

import {
  EndOfQuestionnaire,
  NextPage,
  EndOfCurrentSection,
} from "constants/destinations";

import { destinationKey } from "constants/destinationKey";

import { useQuestionnaire } from "components/QuestionnaireContext";

jest.mock("components/QuestionnaireContext", () => ({
  useQuestionnaire: jest.fn(),
}));

let questionnaire;

const props = {
  data: {
    logicalDestinations: jest.fn(() => [
      {
        id: NextPage,
        displayName: destinationKey[NextPage],
        logicalDestination: NextPage,
      },
      {
        id: EndOfCurrentSection,
        logicalDestination: EndOfCurrentSection,
        displayName: EndOfCurrentSection,
      },
      {
        id: EndOfQuestionnaire,
        displayName: destinationKey[EndOfQuestionnaire],
        logicalDestination: EndOfQuestionnaire,
        displayEnabled: !questionnaire.hub,
      },
    ]),
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
    sections: [
      {
        id: "section-2",
        displayName: "Section two",
      },
      {
        id: "section-3",
        displayName: "Section three",
      },
      {
        id: "section-4",
        displayName: "Section four",
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

    it("should display sections in 'Later sections'", () => {
      const { queryByText, getByText, click } = defaultSetup();
      click(tabTitles.later);
      expect(getByText(tabTitles.later)).toHaveAttribute(
        "aria-selected",
        "true"
      );
      expect(queryByText("Section one")).toBeFalsy();
      expect(getByText("Section two")).toBeVisible();
      expect(getByText("Section three")).toBeVisible();
      expect(getByText("Section four")).toBeVisible();
    });

    it("should display 'Other destinations' options", () => {
      const { getByText, click } = defaultSetup();
      click(tabTitles.other);
      expect(getByText(tabTitles.other)).toHaveAttribute(
        "aria-selected",
        "true"
      );
      expect(getByText(destinationKey[NextPage])).toBeVisible();
      expect(getByText(destinationKey[EndOfCurrentSection])).toBeVisible();
      expect(getByText(destinationKey[EndOfQuestionnaire])).toBeVisible();
    });

    it("should be able to change destination tabs with Space or enter", () => {
      const { getByText, keyPress } = defaultSetup();

      expect(getByText(tabTitles.current)).toHaveAttribute(
        "aria-selected",
        "true"
      );

      // doesn't change with other keyDown
      keyPress(tabTitles.later, { key: "Escape", code: "Escape" });
      expect(getByText(tabTitles.current)).toHaveAttribute(
        "aria-selected",
        "true"
      );

      // changes with Enter
      keyPress(tabTitles.later, { key: "Enter", code: "Enter" });
      expect(getByText(tabTitles.later)).toHaveAttribute(
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
      const LogicalDestinationArray = props.data.logicalDestinations();

      click("Other destinations");
      click(destinationKey[EndOfCurrentSection]);
      expect(onSelected).toHaveBeenCalledTimes(1);
      expect(onSelected).toHaveBeenCalledWith({
        displayName: destinationKey[EndOfCurrentSection],
        id: LogicalDestinationArray[1].id,
        logicalDestination: LogicalDestinationArray[1].logicalDestination,
      });
    });

    it("should display 'Later sections' when hub is disabled", () => {
      const { queryByText } = defaultSetup();
      expect(queryByText(tabTitles.later)).toBeTruthy();
    });

    it("should display 'End of questionnaire' when hub is disabled", () => {
      const { click, queryByText } = defaultSetup();
      click(tabTitles.other);
      expect(queryByText("End of questionnaire")).toBeTruthy();
    });
  });

  describe("Hub is enabled", () => {
    beforeEach(() => {
      questionnaire = { hub: true };
      useQuestionnaire.mockImplementation(() => ({ questionnaire }));
    });

    it("should not display 'Later sections' when hub is enabled", () => {
      const { queryByText } = defaultSetup();
      expect(queryByText(tabTitles.later)).toBeFalsy();
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
