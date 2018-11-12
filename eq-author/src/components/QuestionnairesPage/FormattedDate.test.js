import React from "react";
import { shallow } from "enzyme";
import FormattedDate from "./FormattedDate";

describe("FormattedDate", () => {
  const date = 1513175866395; // the time i wrote this test

  it("should render a formatted date", () => {
    const spy = jest.spyOn(Date.prototype, "toLocaleDateString");
    shallow(<FormattedDate date={date} />);

    expect(spy).toHaveBeenCalledWith("en-GB", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric"
    });
  });
});
