import React from "react";
import { shallow } from "enzyme";
import AnswerTypeButton from "./AnswerTypeButton";
import { IconGridButton } from "components/IconGrid";

let component, handleClick;
const answerType = "TextField";

describe("components/AnswerTypeButton", () => {
  beforeEach(() => {
    handleClick = jest.fn();

    component = shallow(
      <AnswerTypeButton
        type={answerType}
        onClick={handleClick}
        title="Text field"
      />
    );
  });

  it("should render", () => {
    expect(component).toMatchSnapshot();
  });

  describe("when clicked", () => {
    it("should invoke callback with answer type", () => {
      component.find(IconGridButton).simulate("click");
      expect(handleClick).toHaveBeenCalledWith(answerType);
    });
  });
});
