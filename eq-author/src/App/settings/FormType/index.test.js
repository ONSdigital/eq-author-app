import React from "react";
import { render } from "tests/utils/rtl";

import FormType from ".";

describe("Form type", () => {
  const renderEqId = (props) =>
    render(
      <FormType
        formType="123"
        questionnaireId="123-456-789"
        shortName="default"
        errors={[]}
        {...props}
      />
    );

  it("Can render", () => {
    const { getByTestId } = renderEqId();

    const field = getByTestId("default-form-type-input");

    expect(field).toBeVisible();
  });
});
