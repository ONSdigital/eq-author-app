import React from "react";
import { shallow } from "enzyme";
import PreviousAnswerContentPicker from "./PreviousAnswerContentPicker";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";
import { useQuestionnaire } from "components/QuestionnaireContext";
import { useCurrentPageId } from "components/RouterContext";

const mockQuestionnaire = buildQuestionnaire({
  sectionCount: 2,
  pageCount: 2,
});

jest.mock("components/QuestionnaireContext", () => ({
  useQuestionnaire: jest.fn(),
}));

jest.mock("components/RouterContext", () => ({
  useCurrentPageId: jest.fn(),
}));

const render = (props = {}) =>
  shallow(<PreviousAnswerContentPicker {...props} />);

describe("PreviousAnswerContentPicker", () => {
  let props, wrapper;

  jest.useMockImplementation(useQuestionnaire, () => ({
    questionnaire: mockQuestionnaire,
  }));

  jest.useMockImplementation(
    useCurrentPageId,
    () => mockQuestionnaire.sections[1].folders[0].pages[1].id
  );

  beforeEach(() => {
    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
