import React from "react";
import { shallow } from "enzyme";
import PreviousAnswerContentPicker from "./PreviousAnswerContentPicker";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";
import { useQuestionnaire } from "components/QuestionnaireContext";
import { useCurrentPageId } from "components/RouterContext";

const mockQuestionnaire = buildQuestionnaire({
  sectionCount: 1,
  pageCount: 2,
});

mockQuestionnaire.sections[0].folders[0].pages[0].answers = [
  {
    id: "ans-1",
    displayName: "Answer 1",
    properties: {},
    type: "Number",
  },
  {
    id: "ans-2",
    displayName: "Answer 2",
    properties: {},
    type: "Number",
  },
];

jest.mock("components/QuestionnaireContext", () => ({
  useQuestionnaire: jest.fn(),
}));

jest.mock("components/RouterContext", () => ({
  useCurrentPageId: jest.fn(),
}));

useQuestionnaire.mockImplementation(() => ({
  questionnaire: mockQuestionnaire,
}));
useCurrentPageId.mockImplementation(() => "1.1.2");

describe("PreviousAnswerContentPicker", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<PreviousAnswerContentPicker onSubmit={jest.fn()} />);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
