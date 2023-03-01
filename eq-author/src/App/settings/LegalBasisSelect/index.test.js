import React from "react";
import { shallow } from "enzyme";

import LegalBasisField from ".";

const mockUseUpdateTheme = jest.fn();

jest.mock("hooks/useUpdateTheme", () => ({
  __esModule: true,
  default: jest.fn(() => mockUseUpdateTheme),
}));

describe("LegalBasisField", () => {
  let props;

  beforeEach(() => {
    props = {
      selectedLegalBasis: "NOTICE_1",
      shortName: "business",
      questionnaireId: "my-fave-questionnaire",
    };
  });

  it("should render", () => {
    expect(shallow(<LegalBasisField {...props} />)).toMatchSnapshot();
  });

  it("should show the option matching the value as selected", () => {
    const option = shallow(<LegalBasisField {...props} />).find(
      "[selected=true]"
    );
    expect(option.prop("value")).toEqual(props.selectedLegalBasis);
  });

  it("picking the option should update the theme's legal basis", () => {
    shallow(<LegalBasisField {...props} />)
      .find("[value='NOTICE_2']")
      .simulate("change", { name: props.name, value: "NOTICE_2" });

    expect(mockUseUpdateTheme).toHaveBeenCalledWith({
      questionnaireId: props.questionnaireId,
      shortName: props.shortName,
      legalBasisCode: "NOTICE_2",
    });
  });
});
