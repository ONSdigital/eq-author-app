import React from "react";
import { shallow } from "enzyme";
import { UnwrappedDate as Date } from "./";

describe("Date", () => {
  it("should render", () => {
    const wrapper = shallow(
      <Date
        onChange={jest.fn()}
        onUpdate={jest.fn()}
        answer={{
          id: "1",
          label: "Lorem ipsum",
          description: "Description",
          guidance: "Guidance",
          secondaryLabel: null,
          type: "Date",
          properties: {},
          displayName: "Displayname",
          qCode: "test",
        }}
        getValidationError={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
