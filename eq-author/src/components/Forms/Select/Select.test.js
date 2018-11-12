import React from "react";
import { shallow, mount } from "enzyme";
import Select from "./";

const options = ["One", "Two", "Three", "Four", "Five"];

describe("Select", () => {
  let select, handleChange;

  beforeEach(() => {
    handleChange = jest.fn();
    select = (
      <Select
        options={options}
        onChange={handleChange}
        defaultValue={options[0]}
        name="my-select"
        id="my-select"
      />
    );
  });

  it("renders without crashing", () => {
    expect(shallow(select)).toMatchSnapshot();
  });

  it("calls onChange when value chwanged", () => {
    const app = mount(select);
    app.find("select").simulate("change");

    expect(handleChange).toHaveBeenCalled();
  });

  it("changes value when option selected", () => {
    const app = mount(select);
    const event = { target: { value: "three" } };

    app.find("select").simulate("change", event);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: "my-select", value: "three" })
    );
  });
});
