import React from "react";
import { shallow } from "enzyme";
import { useQuery } from "@apollo/react-hooks";

import Loading from "components/Loading";
import { default as ErrorComponent } from "components/Error";

import { IntroductionDesign } from "./";
import IntroductionEditor from "./IntroductionEditor";

const questionnaire = {
  id: "questionnaire-1",
  title: "Test questionnaire",
  introduction: {
    id: "introduction-1",
  },
};

const { introduction } = questionnaire;

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual("@apollo/react-hooks"),
  useQuery: jest.fn(),
}));

useQuery.mockImplementation(() => ({
  loading: false,
  error: false,
  data: { introduction },
}));

describe("Introduction Design", () => {
  it("should render the editor when loaded", () => {
    expect(
      shallow(<IntroductionDesign />).find(IntroductionEditor)
    ).toHaveLength(1);
  });

  it("should render loading whilst loading", () => {
    useQuery.mockImplementationOnce(() => ({
      loading: true,
      error: false,
      data: { introduction },
    }));

    expect(shallow(<IntroductionDesign />).find(Loading)).toHaveLength(1);
  });

  it("should render error when there is no data but it is loaded", () => {
    useQuery.mockImplementationOnce(() => ({
      loading: false,
      error: false,
      data: null,
    }));
    expect(shallow(<IntroductionDesign />).find(ErrorComponent)).toHaveLength(
      1
    );
  });

  it("should render error when there is an error and it has loaded", () => {
    useQuery.mockImplementationOnce(() => ({
      loading: false,
      error: true,
      data: { introduction },
    }));
    expect(shallow(<IntroductionDesign />).find(ErrorComponent)).toHaveLength(
      1
    );
  });
});
