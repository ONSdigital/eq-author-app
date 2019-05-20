import React from "react";
import { shallow } from "enzyme";
import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";
import QuestionnairesView from "App/QuestionnairesPage/QuestionnairesView";

describe("QuestionnairesPage/QuestionnairesView", () => {
  it("allows Modals to be open and closed", () => {
    const wrapper = shallow(
      <QuestionnairesView
        onDeleteQuestionnaire={jest.fn()}
        onCreateQuestionnaire={jest.fn()}
        onDuplicateQuestionnaire={jest.fn()}
      />
    );

    wrapper.find("[data-test='create-questionnaire']").simulate("click");
    expect(wrapper.find(QuestionnaireSettingsModal).prop("isOpen")).toBe(true);

    wrapper.find(QuestionnaireSettingsModal).simulate("close");
    expect(wrapper.find(QuestionnaireSettingsModal).prop("isOpen")).toBe(false);
  });

  it("creates questionnaire after submission", () => {
    const onCreateQuestionnaire = jest.fn();
    const wrapper = shallow(
      <QuestionnairesView
        onDeleteQuestionnaire={jest.fn()}
        onCreateQuestionnaire={onCreateQuestionnaire}
        onDuplicateQuestionnaire={jest.fn()}
      />
    );

    wrapper.find(QuestionnaireSettingsModal).simulate("submit");
    expect(onCreateQuestionnaire).toHaveBeenCalled();
  });

  it("should render questionnaires table when given questionnaires", () => {
    const wrapper = shallow(
      <QuestionnairesView
        onDeleteQuestionnaire={jest.fn()}
        onCreateQuestionnaire={jest.fn()}
        onDuplicateQuestionnaire={jest.fn()}
        questionnaires={[
          {
            id: "1",
            title: "Foo",
            displayName: "Foo",
            shortTitle: "Test title",
            createdAt: "2017/01/02",
            createdBy: {
              id: "2",
              name: "Alan",
            },
          },
        ]}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
