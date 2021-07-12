import React from "react";

import { render } from "tests/utils/rtl";
import Loading from "components/Loading";

import Logic from "../..";
import DisplayPage from ".";
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

  it("can render the add display logic page when there are empty display conditions", () => {
    section.displayConditions = [
      {
        id: "1",
        expressions: [],
      },
    ];

    const { getByTestId } = render(<DisplayPage section={section} />);
    expect(getByTestId("display-page-content")).toBeInTheDocument();
  });

  it.only("should render the first section page when on first section", () => {
    section.position = 0;

    const { debug } = render(<DisplayPage section={section} />);
    debug();
    // expect(getByTestId("display-page-content")).toBeInTheDocument();
  });
});
