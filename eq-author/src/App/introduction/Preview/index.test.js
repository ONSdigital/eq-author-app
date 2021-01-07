import React from "react";
import { shallow } from "enzyme";

import Loading from "components/Loading";

import { IntroductionPreview, Collapsibles } from "./";

describe("Introduction Preview", () => {
  let props;
  beforeEach(() => {
    props = {
      loading: false,
      data: {
        questionnaireIntroduction: {
          id: "1",
          title: "foo",
          description: "<p>bar</p>",
          additionalGuidancePanel: "",
          additionalGuidancePanelSwitch: false,
          secondaryTitle: "secondaryTitle",
          secondaryDescription: "<p>secondaryDescription</p>",
          legalBasis: "NOTICE_1",
          collapsibles: [],
          tertiaryTitle: "tertiaryTitle",
          tertiaryDescription: "tertiaryDescription",
        },
      },
    };
  });

  it("should render", () => {
    expect(shallow(<IntroductionPreview {...props} />)).toMatchSnapshot();
  });

  it("should not show incomplete collapsibles", () => {
    props.data.questionnaireIntroduction.collapsibles = [
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
    expect(
      shallow(<IntroductionPreview {...props} loading />).find(Loading)
    ).toHaveLength(1);
  });

  it("should show no legal description when legal basis is voluntary", () => {
    props.data.questionnaireIntroduction.legalBasis = "VOLUNTARY";
    expect(
      shallow(<IntroductionPreview {...props} />).find(
        "[data-test='legalBasis']"
      )
    ).toHaveLength(0);
  });

  it("should show section 1 legal basis when it is notice 1", () => {
    props.data.questionnaireIntroduction.legalBasis = "NOTICE_1";
    expect(
      shallow(<IntroductionPreview {...props} />).find(
        "[data-test='legalBasis']"
      )
    ).toMatchSnapshot();
  });

  it("should show section 3 and 4 legal basis when it is notice 2", () => {
    props.data.questionnaireIntroduction.legalBasis = "NOTICE_2";
    expect(
      shallow(<IntroductionPreview {...props} />).find(
        "[data-test='legalBasis']"
      )
    ).toMatchSnapshot();
  });

  it("should show additional guidance panel when enabled", () => {
    props.data.questionnaireIntroduction.additionalGuidancePanelSwitch = true;
    props.data.questionnaireIntroduction.additionalGuidancePanel =
      "hello world!";

    const wrapper = shallow(<IntroductionPreview {...props} />);

    expect(wrapper.find("[data-test='additionalGuidancePanel']")).toHaveLength(
      1
    );
  });
});
