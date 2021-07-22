import React from "react";
import { render } from "tests/utils/rtl";

import DestinationPicker, { Title } from "./";

import { useQuestionnaire } from "components/QuestionnaireContext";

jest.mock("components/QuestionnaireContext", () => ({
  useQuestionnaire: jest.fn(),
}));

const data = () => ({
  logicalDestinations: [
    {
      id: "NextPage",
      displayName: "Next page",
      logicalDestination: "NextPage",
    },
    {
      id: "EndOfQuestionnaire",
      displayName: "End of questionnaire",
      logicalDestination: "EndOfQuestionnaire",
    },
  ],
  pages: [
    {
      id: "4e5f227c-e53e-41e8-ae26-03ba2c38e12d",
      displayName: "4",
      section: [
        {
          id: "6988cd62-f385-4641-8c0d-281b195886f2",
          displayName: "Section 1",
        },
      ],
    },
  ],
  sections: [
    {
      id: "ebf76c02-3d49-4ec4-bcff-5bd6447094f2",
      displayName: "Section 2",
    },
  ],
});
const onSelected = jest.fn();
const isSelected = jest.fn();
const questionnaire = { hub: false };

const props = {
  data: data(),
  onSelected,
  isSelected,
};

describe("Destination Picker", () => {
  it("should render", () => {
    useQuestionnaire.mockImplementation(() => ({ questionnaire }));
    const { getByText } = render(<DestinationPicker {...props} />);
    expect(getByText(Title)).toBeVisible();
  });
});
