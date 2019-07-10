import React from "react";
import { render } from "tests/utils/rtl";

import { MeContext } from "App/MeContext";

import AccessDenied from "./";

describe("Access denied page", () => {
  it("should render with access denied message", () => {
    const me = {
      id: "123",
      name: "Zuko",
    };

    const { getByText } = render(
      <MeContext.Provider value={me}>
        <AccessDenied />
      </MeContext.Provider>
    );
    expect(getByText("403 — Access Denied")).toBeTruthy();
  });
});
