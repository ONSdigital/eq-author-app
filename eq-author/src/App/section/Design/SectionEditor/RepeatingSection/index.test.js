import React from "react";
import { render } from "tests/utils/rtl";

import RepeatingSection from ".";
import { useQuery } from "@apollo/react-hooks";

const listnames = [
  {
    id: "123",
    listname: "people",
    displayName: "people",
  },
];

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual("@apollo/react-hooks"),
  useQuery: jest.fn(() => ({
    loading: false,
    error: false,
    data: {
      supplementaryDataListNames: [
        {
          id: "123",
          listname: "people",
          displayName: "people",
        },
      ],
    },
  })),
}));

useQuery.mockImplementationOnce(() => ({
  loading: false,
  error: false,
  data: {
    collectionListNames: listnames,
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

    expect(repeatingToggleField).not.toHaveAttribute("disabled"); // if disabled is undefined then toggle switch is not disabled
  });
});
