import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import SectionMenu from "./SectionMenu";

describe("Content Picker Answer Picker - Section Menu", () => {
  let props;

  const renderSectionMenu = () => render(<SectionMenu {...props} />);

  const section1 = {
    id: "sec1",
    displayName: "section 1",
    folders: [
      {
        pages: [
          {
            id: "Page 1",
            displayName: "Page 1",
            answers: [
              {
                id: "Percentage 1",
                displayName: "Percentage 1",
                type: "Percentage",
              },
            ],
          },
        ],
      },
    ],
  };

  const section2 = {
    id: "sec2",
    displayName: "section 2",
    folders: [
      {
        pages: [
          {
            id: "Page2-1",
            displayName: "Page 2-1",
            answers: [
              {
                id: "Percentage2",
                displayName: "Percentage 2",
                type: "Percentage",
              },
            ],
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    props = {
      data: [section1, section2],
      isSelected: jest.fn(),
      onSelected: jest.fn(),
      isSectionSelected: jest.fn(),
    };
  });

  it("should select first section when no items selected", () => {
    const { getByText } = renderSectionMenu();

    const section1Button = getByText("section 1");
    const section2Button = getByText("section 2");

    expect(section1Button).toHaveAttribute("aria-selected", "true");
    expect(section2Button).toHaveAttribute("aria-selected", "false");
  });

  it("should highlight the selected section", () => {
    const { getByText } = renderSectionMenu();

    const section1Button = getByText("section 1");
    const section2Button = getByText("section 2");

    fireEvent.click(section2Button);

    expect(section1Button).toHaveAttribute("aria-selected", "false");
    expect(section2Button).toHaveAttribute("aria-selected", "true");
  });

  it("should highlight the section of the first selected answer", () => {
    props = {
      ...props,
      firstSelectedItemId: "Percentage2",
    };

    const { getByText } = renderSectionMenu();

    const section1Button = getByText("section 1");
    const section2Button = getByText("section 2");

    expect(section1Button).toHaveAttribute("aria-selected", "false");
    expect(section2Button).toHaveAttribute("aria-selected", "true");
  });
});
