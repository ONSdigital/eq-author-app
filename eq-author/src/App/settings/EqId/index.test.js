import React from "react";
import { render } from "tests/utils/rtl";

import EqId from ".";

describe("EQ Id", () => {
  const renderEqId = (props) =>
    render(
      <EqId
        eId="123"
        questionnaireId="123-456-789"
        shortName="default"
        {...props}
      />
    );

  it("Can render", () => {
    const { getByTestId } = renderEqId();

    const field = getByTestId("default-eq-id-input");

    expect(field).toBeVisible();
  });
});
