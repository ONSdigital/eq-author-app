import React from "react";
import { UnconnectedQuestionnairesPage } from "App/QuestionnairesPage";
import { shallow } from "enzyme";

import { READ } from "constants/questionnaire-permissions";

describe("components/QuestionnairesPage", () => {
  const createWrapper = props =>
    shallow(
      <UnconnectedQuestionnairesPage
        onDeleteQuestionnaire={jest.fn()}
        onCreateQuestionnaire={jest.fn()}
        onDuplicateQuestionnaire={jest.fn()}
        {...props}
      />
    );

  it("should not render table whilst data is loading", () => {
    const wrapper = createWrapper({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render loading message when loading", () => {
    const instance = createWrapper().instance();
    const renderResults = instance.renderResults({
      loading: true,
    });

    expect(renderResults).toMatchSnapshot();
  });

  it("should render when there are no questionnaires", () => {
    const wrapper = createWrapper({ questionnaires: [] });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render error message when there is an error", () => {
    const instance = createWrapper().instance();
    const renderResults = instance.renderResults({
      error: true,
    });

    expect(renderResults).toMatchSnapshot();
  });

  it("should render table when there are questionnaires", () => {
    const questionnaires = [
      {
        id: "1",
        displayName: "Test questionnaire",
        title: "Test questionnaire",
        shortTitle: "Short title",
        createdAt: "01/01/1970",
        updatedAt: "02/01/1970",
        createdBy: {
          name: "Mike",
          id: "1",
          email: "mike@mail.com",
          displayName: "Mike",
        },
        sections: [
          {
            id: "5",
            pages: [{ id: "10" }],
          },
        ],
        permission: READ,
      },
    ];

    const me = {
      id: "1",
      name: "Test",
      email: "test@email.com",
      displayName: "test",
    };

    const wrapper = createWrapper({ questionnaires });
    const instance = wrapper.instance();
    const renderResults = instance.renderResults({
      data: { questionnaires, me },
    });

    expect(wrapper).toMatchSnapshot();
    expect(renderResults).toMatchSnapshot();
  });

  it("should correctly render title", () => {
    const instance = createWrapper().instance();
    const renderTitle = instance.renderTitle("FooBar");

    expect(renderTitle).toMatchSnapshot();
  });
});
