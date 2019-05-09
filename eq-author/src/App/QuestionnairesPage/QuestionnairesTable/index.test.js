import React from "react";
import { shallow } from "enzyme";

import Row from "./Row";
import DeleteConfirmDialog from "components/DeleteConfirmDialog";

import { UnconnectedQuestionnairesTable } from ".";

describe("QuestionnairesTable", () => {
  const questionnaires = [
    {
      id: "1",
      displayName: "Foo",
      title: "Foo",
      shortTitle: "",
      createdAt: "2017/01/02",
      sections: [
        {
          id: "1",
          pages: [{ id: "1" }],
        },
      ],
      createdBy: {
        id: "1",
        name: "Alan",
      },
    },
    {
      id: "2",
      displayName: "Bar",
      title: "Bar",
      shortTitle: "",
      createdAt: "2017/03/04",
      sections: [
        {
          id: "2",
          pages: [{ id: "2" }],
        },
      ],
      createdBy: {
        id: "2",
        name: "Lynn",
      },
    },
  ];

  const user = {
    id: "3",
    name: "Foo",
    email: "foo@bar.com",
    displayName: "Foo",
  };

  let handleDeleteQuestionnaire, handleDuplicateQuestionnaire;

  beforeEach(() => {
    handleDeleteQuestionnaire = jest.fn();
    handleDuplicateQuestionnaire = jest.fn();
  });

  it("should render", () => {
    const wrapper = shallow(
      <UnconnectedQuestionnairesTable
        questionnaires={questionnaires}
        onDeleteQuestionnaire={handleDeleteQuestionnaire}
        onDuplicateQuestionnaire={handleDuplicateQuestionnaire}
        user={user}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render message when no questionnaires", () => {
    const wrapper = shallow(
      <UnconnectedQuestionnairesTable
        questionnaires={[]}
        onDeleteQuestionnaire={handleDeleteQuestionnaire}
        onDuplicateQuestionnaire={handleDuplicateQuestionnaire}
        user={user}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should open and close delete confirm modal when required", () => {
    const wrapper = shallow(
      <UnconnectedQuestionnairesTable
        questionnaires={questionnaires}
        onDeleteQuestionnaire={handleDeleteQuestionnaire}
        onDuplicateQuestionnaire={handleDuplicateQuestionnaire}
        user={user}
      />
    );

    expect(wrapper.find(DeleteConfirmDialog).prop("isOpen")).toBeFalsy();

    wrapper
      .find(Row)
      .first()
      .simulate("deleteQuestionnaire", { id: "1" });

    expect(wrapper.find(DeleteConfirmDialog).prop("isOpen")).toBeTruthy();

    wrapper.find(DeleteConfirmDialog).simulate("close");
    expect(wrapper.find(DeleteConfirmDialog).prop("isOpen")).toBeFalsy();
  });

  it("should autofocus the next row after when one is deleted", () => {
    const wrapper = shallow(
      <UnconnectedQuestionnairesTable
        questionnaires={questionnaires}
        onDeleteQuestionnaire={handleDeleteQuestionnaire}
        onDuplicateQuestionnaire={handleDuplicateQuestionnaire}
        user={user}
      />
    );

    wrapper
      .find(Row)
      .first()
      .simulate("deleteQuestionnaire", { id: "1" });

    wrapper.find(DeleteConfirmDialog).simulate("delete");

    expect(
      wrapper
        .find(Row)
        .at(1)
        .props()
    ).toMatchObject({
      autoFocus: true,
      questionnaire: {
        id: "2",
      },
    });
  });

  it("should autofocus the last row if the last row is deleted", () => {
    const wrapper = shallow(
      <UnconnectedQuestionnairesTable
        questionnaires={questionnaires}
        onDeleteQuestionnaire={handleDeleteQuestionnaire}
        onDuplicateQuestionnaire={handleDuplicateQuestionnaire}
        user={user}
      />
    );

    wrapper
      .find(Row)
      .first()
      .simulate("deleteQuestionnaire", { id: "2" });

    wrapper.find(DeleteConfirmDialog).simulate("delete");

    expect(
      wrapper
        .find(Row)
        .at(0)
        .props()
    ).toMatchObject({
      autoFocus: true,
      questionnaire: {
        id: "1",
      },
    });
  });
});
