import React from "react";

import { render } from "tests/utils/rtl";
import Loading from "components/Loading";

import Logic from "..";
import DisplayPage from "./DisplayPage";
const mockUseQuery = jest.fn();
const mockUseMutation = jest.fn();

jest.mock("@apollo/react-hooks", () => ({
  useQuery: () => [mockUseQuery],
  useMutation: () => [mockUseMutation],
}));

describe("Section display rule", () => {
  let section = {};

  beforeEach(() => {
    section = {
      questionnaire: {
        id: "1",
        hub: true,
      },
      id: "1",
      position: 1,
    };
  });

  it("should render the add display logic page when there is no display logic", () => {
    const { getByTestId } = render(<DisplayPage section={section} />);
    expect(getByTestId("btn-add-display")).toBeInTheDocument();
  });

  it.only("should render the add display logic page when add display logic button is clicked", () => {
    section.displayConditions = [
      {
        id: "cd79cf69-6ecc-463a-bd60-e8fba324d420",
        operator: "And",
        expressions: [
          {
            id: "57b87bde-d9a4-411b-9184-3c4d8ab79c05",
            condition: "Equal",
            left: {
              type: "Null",
              answerId: "",
              nullReason: "DefaultDisplayCondition",
            },
          },
        ],
      },
    ];

    const { debug } = render(<DisplayPage section={section} />);
    debug();
  });
});
