import React from "react";
import { render } from "tests/utils/rtl";

import RepeatingSection from ".";
import { useQuery } from "@apollo/react-hooks";

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual("@apollo/react-hooks"),
  useQuery: jest.fn(),
}));

const collectionLists = {
  id: "collection-list-1",
  lists: [
    {
      id: "list-1",
      listName: "List 1",
      displayName: "List 1",
      answers: [
        {
          id: "list-answer-1",
          type: "TextField",
          label: "List answer 1",
        },
      ],
    },
  ],
};

useQuery.mockImplementation(() => ({
  loading: false,
  error: false,
  data: {
    collectionLists,
  },
}));

const renderRepeatingSection = (props) => {
  return render(<RepeatingSection {...props} />);
};

describe("RepeatingSection", () => {
  let section;

  beforeEach(() => {
    section = {
      id: "section-1",
      position: 1,
      allowRepeatingSection: true,
      repeatingSection: false,
      folders: [
        {
          id: "folder-1",
          pages: [
            {
              id: "page-1",
              answer: [
                {
                  id: "answer-1",
                },
              ],
            },
          ],
        },
      ],
      validationErrorInfo: {
        errors: [],
        totalCount: 0,
      },
    };
  });

  describe("First section", () => {
    it("should disable repeating section toggle switch on first section if repeatingSection is false", () => {
      section.position = 0;

      const { getByTestId } = renderRepeatingSection({
        section,
        handleUpdate: jest.fn(),
      });
      const repeatingToggleField = getByTestId(
        "repeating-section-toggle-field"
      );

      expect(repeatingToggleField).toHaveAttribute("disabled", ""); // if disabled === "" then toggle switch is disabled
    });

    it("should not disable repeating section toggle switch on first section if repeatingSection is true", () => {
      section.position = 0;
      section.repeatingSection = true;

      const { getByTestId } = renderRepeatingSection({
        section,
        handleUpdate: jest.fn(),
      });
      const repeatingToggleField = getByTestId(
        "repeating-section-toggle-field"
      );

      expect(repeatingToggleField).not.toHaveAttribute("disabled"); // if !disabled then toggle switch is not disabled
    });
  });

  it("should disable repeating section toggle switch if allowRepeatingSection is false", () => {
    section.allowRepeatingSection = false;
    const { getByTestId } = renderRepeatingSection({
      section,
      handleUpdate: jest.fn(),
    });
    const repeatingToggleField = getByTestId("repeating-section-toggle-field");

    expect(repeatingToggleField).toHaveAttribute("disabled", ""); // if disabled === "" then toggle switch is disabled
  });

  it("should not disable repeating section toggle switch if allowRepeatingSection is true", () => {
    const { getByTestId } = renderRepeatingSection({
      section,
      handleUpdate: jest.fn(),
    });
    const repeatingToggleField = getByTestId("repeating-section-toggle-field");

    expect(repeatingToggleField).not.toHaveAttribute("disabled"); // if !disabled then toggle switch is not disabled
  });
});
