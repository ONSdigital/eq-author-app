import React from "react";

import { render } from "tests/utils/rtl";

import ValidationsContext, { withValidations } from "./";

describe("Validations Context", () => {
  it("should provide the validation context as a prop", () => {
    const Component = withValidations(({ validations, anotherProp }) => (
      <div>
        {anotherProp} - {validations}
      </div>
    ));
    const { getByText } = render(
      <ValidationsContext.Provider value={{ validations: "validations" }}>
        <Component anotherProp="anotherProp" />
      </ValidationsContext.Provider>
    );
    expect(getByText(/validations/)).toBeTruthy();
    expect(getByText(/anotherProp/)).toBeTruthy();
  });
});
