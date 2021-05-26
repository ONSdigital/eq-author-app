import React from "react";
import { render } from "tests/utils/rtl";

import PreviewTheme from ".";

describe("Preview theme", () => {
  const renderEqId = (props) =>
    render(
      <PreviewTheme
        thisTheme="default"
        previewTheme="default"
        questionnaireId="123-456-789"
        {...props}
      />
    );

  it("Can render", () => {
    const { getByLabelText } = renderEqId();

    const field = getByLabelText("Preview theme");

    expect(field).toBeVisible();
  });
});
