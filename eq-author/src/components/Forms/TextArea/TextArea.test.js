import React from "react";
import { render } from "tests/utils/rtl";
import TextArea from "./";

const defaultValue = "I am some text";

describe("components/Forms/TextArea", () => {
  let changeHandler;

  beforeEach(() => {
    changeHandler = jest.fn();
  });

  it("should render correctly", function () {
    expect(
      render(
        <TextArea
          id="text"
          name="text"
          defaultValue={defaultValue}
          onChange={changeHandler}
        />
      ).asFragment()
    ).toMatchSnapshot();
  });

  it("should pass `defaultValue` prop to component when type=text", () => {
    const { getByText } = render(
      <TextArea
        id="text"
        name="text"
        defaultValue={defaultValue}
        onChange={changeHandler}
      />
    );
    expect(getByText(defaultValue)).toBeTruthy();
  });
});
