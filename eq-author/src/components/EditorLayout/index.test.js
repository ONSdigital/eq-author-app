import React from "react";
import { shallow } from "enzyme";

import EditorLayout from "./";

describe("Editor Layout", () => {
  it("should render", () => {
    const props = {
      onAddPage: jest.fn(),
      page: {
        id: "1",
        displayName: "Foo",
        answers: []
      },
      design: true,
      preview: false,
      routing: true
    };
    const wrapper = shallow(<EditorLayout {...props}>Content</EditorLayout>);
    expect(wrapper).toMatchSnapshot();
  });
});
