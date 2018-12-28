import React from "react";
import { shallow } from "enzyme";
import Form from "./";

let wrapper;
const handleSubmit = jest.fn();
describe("components/Forms/Form", () => {
  beforeEach(() => {
    wrapper = shallow(
      <Form onSubmit={handleSubmit}>
        <input name="input" type="text" />
      </Form>
    );
  });

  it("should render correctly", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onSubmit", () => {
    wrapper.simulate("submit");
    expect(handleSubmit).toHaveBeenCalled();
  });
});
