import React from "react";
import { render } from "tests/utils/rtl";

import SelectedAnswer from "./SelectedAnswer";

describe("Selected answer", () => {
  let mockProperties, mockOnRemove, mockDisplayName, mockType, mockPage;

  beforeEach(() => {
    mockProperties = {
      unit: "Centimeter",
    };

    mockOnRemove = jest.fn();

    mockDisplayName = "Star Wars: The Old Republic";

    mockType = "Unit";
  });

  it("Can render", () => {
    const { getByText } = render(
      <SelectedAnswer
        properties={mockProperties}
        onRemove={mockOnRemove}
        displayName={mockDisplayName}
        type={mockType}
      />
    );

    const answerName = getByText("Star Wars: The Old Republic");
    expect(answerName).toBeInTheDocument();

    const type = getByText("Unit");
    expect(type).toBeInTheDocument();

    const unit = getByText("Centimeter");
    expect(unit).toBeInTheDocument();
  });

  it("Does not show the unit type if there is none", () => {
    mockType = "Number";
    mockProperties.unit = "";

    const { queryByTestId } = render(
      <SelectedAnswer
        properties={mockProperties}
        onRemove={mockOnRemove}
        displayName={mockDisplayName}
        type={mockType}
      />
    );

    const unitType = queryByTestId("unit-type");

    expect(unitType).not.toBeInTheDocument();
  });

  it("displays the calculated summary page type", () => {
    mockType = "Number";
    mockPage = {
      pageType: "CalculatedSummaryPage",
    };

    const { getByText } = render(
      <SelectedAnswer
        properties={mockProperties}
        onRemove={mockOnRemove}
        displayName={mockDisplayName}
        type={mockType}
        page={mockPage}
      />
    );

    const pageType = getByText("Calculated summary");
    expect(pageType).toBeInTheDocument();
  });

  it("displays the list collector follow-up page type", () => {
    mockType = "Number";

    const { getByText } = render(
      <SelectedAnswer
        properties={mockProperties}
        onRemove={mockOnRemove}
        displayName={mockDisplayName}
        type={mockType}
        insideListCollectorFolder
      />
    );

    const pageType = getByText("List collector follow-up");
    expect(pageType).toBeInTheDocument();
  });
});
