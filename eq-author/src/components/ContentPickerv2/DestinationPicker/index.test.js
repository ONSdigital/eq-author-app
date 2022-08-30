import React from "react";
import { render } from "tests/utils/rtl";

import DestinationPicker, { Title } from "./";

import {
  NextPage,
  EndOfCurrentSection,
} from "constants/destinations";

import { useQuestionnaire } from "components/QuestionnaireContext";

jest.mock("components/QuestionnaireContext", () => ({
  useQuestionnaire: jest.fn(),
}));

const data = () => ({
  logicalDestinations: {
    [NextPage]: {
      id: NextPage,
      displayName: "Next Page",
      logicalDestination: NextPage,
    },
    [EndOfCurrentSection]: {
      id: EndOfCurrentSection,
      logicalDestination: EndOfCurrentSection,
      displayName: "End of section",
    }
  },
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
  ]
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
