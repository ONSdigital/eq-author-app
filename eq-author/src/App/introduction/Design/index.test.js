import React from "react";
import { shallow } from "enzyme";

import Loading from "components/Loading";
import { default as ErrorComponent } from "components/Error";

import { IntroductionDesign } from "./";
import IntroductionEditor from "./IntroductionEditor";

describe("Introduction Design", () => {
  let props;

  beforeEach(() => {
    props = {
      loading: false,
      error: null,
      data: {
        questionnaireIntroduction: {
          id: "1",
          comments: [],
        },
      },
    };
  });

  it("should render the editor when loaded", () => {
    expect(
      shallow(<IntroductionDesign {...props} />).find(IntroductionEditor)
    ).toHaveLength(1);
  });

  it("should render loading whilst loading", () => {
    expect(
      shallow(<IntroductionDesign {...props} loading />).find(Loading)
    ).toHaveLength(1);
  });

  it("should render error when there is no data but it is loaded", () => {
    props.data = null;
    expect(
      shallow(<IntroductionDesign {...props} />).find(ErrorComponent)
    ).toHaveLength(1);
  });

  it("should render error when there an error and it has loaded", () => {
    props.error = new Error("It broke");
    expect(
      shallow(<IntroductionDesign {...props} />).find(ErrorComponent)
    ).toHaveLength(1);
  });
});
