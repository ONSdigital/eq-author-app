import React from "react";
import { render } from "tests/utils/rtl";

import DestinationPicker, { Title } from "./";

// Oh boy this is gonna be a fun one

// will be a really good opportunity to refactor some tests
// jest.mock("./Menu.js", () => {
//   return "menu";
// });

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

const props = {
  data: data(),
  onSelected,
  isSelected,
};

describe("Destination Picker", () => {
  it("should render", () => {
    const { getByText } = render(<DestinationPicker {...props} />);
    expect(getByText(Title)).toBeVisible();
  });
});
