import React from "react";
import { shallow } from "enzyme";

import LegalBasisField, { LegalOption } from "./LegalBasisField";

describe("LegalBasisField", () => {
  let props;

  beforeEach(() => {
    props = {
      name: "legalBasis",
      value: "NOTICE_1",
      onChange: jest.fn(),
    };
  });
  it("should render", () => {
    expect(shallow(<LegalBasisField {...props} />)).toMatchSnapshot();
  });

  it("should show the option matching the value as selected", () => {
    const option = shallow(<LegalBasisField {...props} />).find(
      "[selected=true]"
    );
    expect(option.prop("value")).toEqual(props.value);
  });

  it("picking the option should trigger onChange", () => {
    shallow(<LegalBasisField {...props} />)
      .find("[value='NOTICE_2']")
      .simulate("change", { name: props.name, value: "NOTICE_2" });

    expect(props.onChange).toHaveBeenCalledWith({
      name: props.name,
      value: "NOTICE_2",
    });
  });

  describe("LegalOption", () => {
    it("should render", () => {
      const props = {
        name: "legalBasis",
        value: "NOTICE_1",
        onChange: jest.fn(),
        selected: false,
      };
      expect(
        shallow(<LegalOption {...props}>hello world</LegalOption>)
      ).toMatchSnapshot();
    });
  });
});
