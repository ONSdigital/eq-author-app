import React from "react";
import { shallow } from "enzyme";
import { SynchronousPromise } from "synchronous-promise";

import Row from "./Row";

import { UnconnectedQuestionnairesTable } from "./";

describe("QuestionnairesTable", () => {
  const questionnaires = [
    {
      id: "1",
      title: "Foo",
      createdAt: "2017/01/02",
      sections: [
        {
          id: "1",
          pages: [{ id: "1" }]
        }
      ],
      createdBy: {
        name: "Alan"
      }
    },
    {
      id: "2",
      title: "Bar",
      createdAt: "2017/03/04",
      sections: [
        {
          id: "2",
          pages: [{ id: "2" }]
        }
      ],
      createdBy: {
        name: "Lynn"
      }
    }
  ];

  const user = {
    email: "foo@bar.com",
    displayName: "Foo"
  };

  let handleDeleteQuestionnaire, handleDuplicateQuestionnaire, headRef;

  beforeEach(() => {
    handleDeleteQuestionnaire = jest.fn();
    handleDuplicateQuestionnaire = jest.fn();
    headRef = {
      current: {
        scrollIntoView: jest.fn()
      }
    };
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

  it("should scroll header into view on duplicate", () => {
    const handleDuplicateQuestionnaire = jest
      .fn()
      .mockResolvedValue({ id: "3" });
    const wrapper = shallow(
      <UnconnectedQuestionnairesTable
        questionnaires={questionnaires}
        onDeleteQuestionnaire={handleDeleteQuestionnaire}
        onDuplicateQuestionnaire={handleDuplicateQuestionnaire}
        user={user}
      />
    );

    const instance = wrapper.instance();
    const headRef = {
      current: {
        scrollIntoView: jest.fn()
      }
    };
    instance.headRef = headRef;

    wrapper
      .find(Row)
      .first()
      .simulate("duplicateQuestionnaire");

    expect(headRef.current.scrollIntoView).toHaveBeenCalled();
  });

  it("should auto focus the duplicated row", () => {
    const handleDuplicateQuestionnaire = jest.fn(() =>
      SynchronousPromise.resolve({ id: "3" })
    );
    const wrapper = shallow(
      <UnconnectedQuestionnairesTable
        questionnaires={questionnaires}
        onDeleteQuestionnaire={handleDeleteQuestionnaire}
        onDuplicateQuestionnaire={handleDuplicateQuestionnaire}
        user={user}
      />
    );

    const instance = wrapper.instance();
    instance.headRef = headRef;

    wrapper
      .find(Row)
      .first()
      .simulate("duplicateQuestionnaire");

    wrapper.setProps({
      questionnaires: [
        {
          id: "3",
          title: "My dupe",
          createdAt: "12-09-2040",
          createdBy: {
            displayName: "Dave"
          }
        },
        ...questionnaires
      ]
    });

    wrapper.update();

    expect(
      wrapper
        .find(Row)
        .first()
        .props()
    ).toMatchObject({ autoFocus: true });
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
      .simulate("deleteQuestionnaire", "1");

    expect(
      wrapper
        .find(Row)
        .at(1)
        .props()
    ).toMatchObject({
      autoFocus: true,
      questionnaire: {
        id: "2"
      }
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
      .simulate("deleteQuestionnaire", "2");

    expect(
      wrapper
        .find(Row)
        .at(0)
        .props()
    ).toMatchObject({
      autoFocus: true,
      questionnaire: {
        id: "1"
      }
    });
  });
});
