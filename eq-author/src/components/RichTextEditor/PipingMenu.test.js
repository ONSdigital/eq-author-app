import React from "react";
import {
  Menu as PipingMenu,
  MenuButton as PipingMenuButton
} from "./PipingMenu";
import { shallow } from "enzyme";
import { CHECKBOX, RADIO, DATE_RANGE, TEXTFIELD } from "constants/answer-types";

describe("PipingMenu", () => {
  let handleItemChosen, questionnaire;

  const render = (props = {}) => {
    const section = questionnaire.sections[0];
    const page = section.pages[1];
    return shallow(
      <PipingMenu
        match={createMatch(questionnaire.id, section.id, page.id)}
        onItemChosen={handleItemChosen}
        data={{
          questionnaire
        }}
        {...props}
      />
    );
  };

  const createMatch = (questionnaireId, sectionId, pageId) => ({
    params: {
      questionnaireId,
      sectionId,
      pageId
    }
  });

  beforeEach(() => {
    handleItemChosen = jest.fn();

    questionnaire = {
      id: "1",
      metadata: [
        {
          id: "1",
          alias: "Some metadata"
        },
        {
          id: "1",
          alias: "Another metadata"
        }
      ],
      sections: [
        {
          id: "1",
          pages: [
            {
              id: "1",
              answers: [
                {
                  id: "1",
                  label: "Answer 1",
                  type: TEXTFIELD
                },
                {
                  id: "2",
                  label: "Answer 2",
                  type: TEXTFIELD
                }
              ]
            },
            {
              id: "2",
              answers: [
                {
                  id: "3",
                  label: "Answer 3",
                  type: TEXTFIELD
                }
              ]
            }
          ]
        },
        {
          id: "2",
          pages: [
            {
              id: "3",
              answers: [
                {
                  id: "4",
                  label: "Answer 4",
                  type: TEXTFIELD
                },
                {
                  id: "5",
                  label: "Answer 5",
                  type: TEXTFIELD
                }
              ]
            },
            {
              id: "4",
              answers: [
                {
                  id: "6",
                  label: "Answer 6",
                  type: TEXTFIELD
                }
              ]
            }
          ]
        }
      ]
    };
  });

  it("should render", () => {
    const wrapper = render({
      data: {
        questionnaire
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render as disabled when disabled", () => {
    const wrapper = render({
      disabled: true
    });
    expect(wrapper.find(PipingMenuButton).prop("disabled")).toBe(true);
  });

  it("should render as disabled when loading", () => {
    const wrapper = render({
      loading: true
    });
    expect(wrapper.find(PipingMenuButton).prop("disabled")).toBe(true);
  });

  it("should render as disabled when there is no questionnaire", () => {
    const wrapper = render({
      data: {
        questionnaire: undefined
      }
    });
    expect(wrapper.find(PipingMenuButton).prop("disabled")).toBe(true);
  });

  it("should render as disabled if on first page of first section and no metadata", () => {
    questionnaire.metadata = [];
    const section = questionnaire.sections[0];
    const page = section.pages[0];
    const wrapper = render({
      data: {
        questionnaire
      },
      match: createMatch(questionnaire.id, section.id, page.id)
    });

    expect(wrapper.find(PipingMenuButton).prop("disabled")).toBe(true);
  });

  it("should not be disabled if there are no answers but there is metadata", () => {
    const section = questionnaire.sections[0];
    const page = section.pages[0];
    const wrapper = render({
      data: {
        questionnaire
      },
      match: createMatch(questionnaire.id, section.id, page.id)
    });

    expect(wrapper.find(PipingMenuButton).prop("disabled")).toBe(false);
  });

  it("should only allow selection of answers before the current page", () => {
    const section = questionnaire.sections[1];
    const page = section.pages[1];

    const wrapper = render({
      match: createMatch(questionnaire.id, section.id, page.id)
    });
    const data = wrapper.find("[data-test='picker']").prop("answerData");

    expect({
      sections: data
    }).toMatchSnapshot();
  });

  it("shouldn't show current section if on first page of section", () => {
    const section = questionnaire.sections[1];
    const page = section.pages[0];

    const wrapper = render({
      match: createMatch(questionnaire.id, section.id, page.id)
    });
    const data = wrapper.find("[data-test='picker']").prop("answerData");

    expect({
      sections: data
    }).toMatchSnapshot();
  });

  it("should filter out checkbox answer types", () => {
    questionnaire.sections[0].pages[0].answers[0].type = CHECKBOX;

    const wrapper = render({
      match: createMatch(questionnaire.id, "1", "2")
    });
    const data = wrapper.find("[data-test='picker']").prop("answerData");

    expect({
      sections: data
    }).toMatchSnapshot();
  });

  it("should filter out radio answer types", () => {
    questionnaire.sections[0].pages[0].answers[0].type = RADIO;

    const wrapper = render({
      match: createMatch(questionnaire.id, "1", "2")
    });
    const data = wrapper.find("[data-test='picker']").prop("answerData");

    expect({
      sections: data
    }).toMatchSnapshot();
  });

  it("should return child answers for CompositeAnswers", () => {
    questionnaire.sections[0].pages[0].answers[0] = {
      id: "1",
      __typename: "CompositeAnswer",
      type: DATE_RANGE,
      childAnswers: [
        {
          id: "20",
          type: TEXTFIELD,
          displayName: "Earliest"
        },
        {
          id: "21",
          type: TEXTFIELD,
          displayName: "Latest"
        }
      ]
    };
    const section = questionnaire.sections[1];
    const page = section.pages[0];
    const wrapper = render({
      match: createMatch(questionnaire.id, section.id, page.id)
    });
    const data = wrapper.find("[data-test='picker']").prop("answerData");

    expect({
      sections: data
    }).toMatchSnapshot();
  });

  it("should open the picker when clicked", () => {
    const section = questionnaire.sections[0];
    const page = section.pages[0];
    const wrapper = render({
      match: createMatch(questionnaire.id, section.id, page.id)
    });
    wrapper.find("[data-test='piping-button']").simulate("click");
    expect(wrapper.find("[data-test='picker']").prop("isOpen")).toBe(true);
  });

  it("should call onItemChosen and close the picker when something is chosen", () => {
    const section = questionnaire.sections[0];
    const page = section.pages[0];
    const wrapper = render({
      match: createMatch(questionnaire.id, section.id, page.id)
    });
    wrapper.find("[data-test='piping-button']").simulate("click");
    wrapper.find("[data-test='picker']").simulate("submit", {
      id: 1,
      displayName: "item"
    });
    expect(handleItemChosen).toHaveBeenCalledWith({
      id: 1,
      displayName: "item"
    });
    expect(wrapper.find("[data-test='picker']").prop("isOpen")).toBe(false);
  });

  it("should close the picker on picker close event", () => {
    const section = questionnaire.sections[0];
    const page = section.pages[0];
    const wrapper = render({
      match: createMatch(questionnaire.id, section.id, page.id)
    });
    wrapper.find("[data-test='piping-button']").simulate("click");
    wrapper.find("[data-test='picker']").simulate("close");
    expect(wrapper.find("[data-test='picker']").prop("isOpen")).toBe(false);
  });
});
