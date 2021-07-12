import React from "react";

import { render } from "tests/utils/rtl";

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

  it("should render the first section page when on first section", () => {
    section.position = 0;

    const { getByText } = render(<DisplayPage section={section} />);
    expect(
      getByText(
        "You can't add display logic to the first section in a questionnaire"
      )
    ).toBeInTheDocument();
  });

  it("should disable create display logic button when on first section", () => {
    section.position = 0;

    const { getByTestId } = render(<DisplayPage section={section} />);
    expect(getByTestId("btn-add-display")).toBeDisabled();
  });

  it("should display hub disabled content when questionnaire hub settings are disabled", () => {
    section.questionnaire.hub = false;

    const { getByText } = render(<DisplayPage section={section} />);
    expect(
      getByText(
        "You can only add display logic when hub navigation is turned on. You can turn on hub navigation in Settings."
      )
    ).toBeInTheDocument();
  });

  it("should disable create display logic button when hub is disabled", () => {
    section.questionnaire.hub = false;

    const { getByTestId } = render(<DisplayPage section={section} />);
    expect(getByTestId("btn-add-display")).toBeDisabled();
  });
});
