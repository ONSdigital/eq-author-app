import React from "react";
import { render } from "tests/utils/rtl";

import Item from ".";
import { colors } from "constants/theme";

const setup = (props) => render(<Item {...props} />);

describe("QuestionPicker item", () => {
  let props;

  beforeEach(() => {
    props = {
      title: "title",
    };
  });

  it("should display heading if variant is heading", () => {
    const { getByTestId } = setup({ ...props, variant: "heading" });

    expect(getByTestId("question-picker-item")).toHaveStyleRule(
      "background-color",
      colors.lightMediumGrey
    );
  });
});
