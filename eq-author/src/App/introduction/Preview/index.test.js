import React from "react";
import { shallow } from "enzyme";

import Loading from "components/Loading";

import { useQuery } from "@apollo/react-hooks";

import IntroductionPreview, { Collapsibles } from "./IntroductionPreview";
import Preview from ".";

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual("@apollo/react-hooks"),
  useQuery: jest.fn(),
}));

useQuery.mockImplementation(() => ({
  loading: false,
  error: false,
  data: {},
}));

describe("Introduction Preview", () => {
  let props;
  beforeEach(() => {
    props = {
      loading: false,
      introduction: {
        id: "1",
        title: "foo",
        description: "<p>bar</p>",
        additionalGuidancePanel: "",
        additionalGuidancePanelSwitch: false,
        secondaryTitle: "secondaryTitle",
        secondaryDescription: "<p>secondaryDescription</p>",
        collapsibles: [],
        tertiaryTitle: "tertiaryTitle",
        tertiaryDescription: "tertiaryDescription",
        contactDetailsPhoneNumber: "0300 1234 931",
        contactDetailsEmailAddress: "surveys@ons.gov.uk",
      },
      match: {
        params: {
          questionnaireId: "1",
        },
      },
    };
  });

  it("should render", () => {
    expect(shallow(<IntroductionPreview {...props} />)).toMatchSnapshot();
  });

  it("should not show incomplete collapsibles", () => {
    props.introduction.collapsibles = [
      { id: "2", title: "collapsible title", description: "" },
      { id: "3", title: "", description: "collapsible description" },
      {
        id: "4",
        title: "collapsible title",
        description: "collapsible description",
      },
    ];
    expect(
      shallow(<IntroductionPreview {...props} />).find(Collapsibles)
    ).toHaveLength(1);
  });

  it("should show loading when loading", () => {
    useQuery.mockImplementationOnce(() => ({
      loading: true,
    }));
    expect(shallow(<Preview {...props} />).find(Loading)).toHaveLength(1);
  });

  it("should show additional guidance panel when enabled", () => {
    props.introduction.additionalGuidancePanelSwitch = true;
    props.introduction.additionalGuidancePanel = "hello world!";

    const wrapper = shallow(<IntroductionPreview {...props} />);

    expect(wrapper.find("[data-test='additionalGuidancePanel']")).toHaveLength(
      1
    );
  });
});
