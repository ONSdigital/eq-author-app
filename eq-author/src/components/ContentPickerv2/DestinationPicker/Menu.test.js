import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import Menu, { tabTitles } from "./Menu";

import { colors } from "constants/theme";

import {
  destinationKey,
  EndOfQuestionnaire,
  NextPage,
  EndOfCurrentSection,
} from "constants/destinations";

const props = {
  data: {
    logicalDestinations: [
      {
        id: NextPage,
        displayName: destinationKey[NextPage],
        logicalDestination: NextPage,
      },
      {
        id: EndOfQuestionnaire,
        displayName: destinationKey[EndOfQuestionnaire],
        logicalDestination: EndOfQuestionnaire,
      },
    ],
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

  const click = name => fireEvent.click(utils.getByText(name));

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
  it("should default to current section tab", () => {
    const { getByText } = defaultSetup();
    expect(getByText("Question one")).toBeVisible();
  });

  it("should show active styling for current tab", () => {
    const { getByText } = defaultSetup();
    expect(getByText(tabTitles.current)).toHaveStyleRule(
      "background-color",
      colors.lighterGrey
    );
  });

  it("should display question pages in 'Current section'", () => {
    const { getByText } = defaultSetup();
    expect(getByText(tabTitles.current)).toHaveStyleRule(
      "background-color",
      colors.lighterGrey
    );
    expect(getByText("Question one")).toBeVisible();
    expect(getByText("Question two")).toBeVisible();
    expect(getByText("Question three")).toBeVisible();
    expect(getByText("Question four")).toBeVisible();
  });

  it("should display sections in 'Later sections'", () => {
    const { queryByText, getByText, click } = defaultSetup();
    click(tabTitles.later);
    expect(getByText(tabTitles.later)).toHaveStyleRule(
      "background-color",
      colors.lighterGrey
    );
    expect(queryByText("Section one")).toBeFalsy();
    expect(getByText("Section two")).toBeVisible();
    expect(getByText("Section three")).toBeVisible();
    expect(getByText("Section four")).toBeVisible();
  });

  it("should display 'Other destinations' options", () => {
    const { getByText, click } = defaultSetup();
    click(tabTitles.other);
    expect(getByText(tabTitles.other)).toHaveStyleRule(
      "background-color",
      colors.lighterGrey
    );
    expect(getByText(destinationKey[NextPage])).toBeVisible();
    expect(getByText(destinationKey[EndOfCurrentSection])).toBeVisible();
    expect(getByText(destinationKey[EndOfQuestionnaire])).toBeVisible();
  });

  it("should display only display 'Current section' and 'Other destinations' tab when missing destinations in the 'Later sections'", () => {});

  it("should be able to change destination tabs with Space or enter", () => {
    const { getByText, keyPress } = defaultSetup();

    expect(getByText(tabTitles.current)).toHaveStyleRule(
      "background-color",
      colors.lighterGrey
    );

    // doesn't change with other keyDown
    keyPress(tabTitles.later, { key: "Escape", code: "Escape" });
    expect(getByText(tabTitles.current)).toHaveStyleRule(
      "background-color",
      colors.lighterGrey
    );

    // changes with Enter
    keyPress(tabTitles.later, { key: "Enter", code: "Enter" });
    expect(getByText(tabTitles.later)).toHaveStyleRule(
      "background-color",
      colors.lighterGrey
    );

    // changes with Space
    keyPress(tabTitles.other, { key: " ", code: "Space" });
    expect(getByText(tabTitles.other)).toHaveStyleRule(
      "background-color",
      colors.lighterGrey
    );
  });

  it("should be able to change destination tabs with click", () => {
    const { getByText, click } = defaultSetup();

    click(tabTitles.later);
    expect(getByText(tabTitles.later)).toHaveStyleRule(
      "background-color",
      colors.lighterGrey
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

    click("Other destinations");
    click(destinationKey[EndOfCurrentSection]);
    expect(onSelected).toHaveBeenCalledTimes(1);
    expect(onSelected).toHaveBeenCalledWith({
      ...props.data.pages[3],
      displayName: destinationKey[EndOfCurrentSection],
    });
  });
});
