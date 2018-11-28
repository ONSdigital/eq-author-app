import React from "react";
import { shallow } from "enzyme";

import IconButtonDelete from "components/IconButtonDelete";
import DuplicateButton from "components/DuplicateButton";

import Row from "./Row";

describe("Row", () => {
  let questionnaire, handleDeleteQuestionnaire, handleDuplicateQuestionnaire;

  beforeEach(() => {
    questionnaire = {
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
    };
    handleDeleteQuestionnaire = jest.fn();
    handleDuplicateQuestionnaire = jest.fn();
  });

  it("should render", () => {
    const wrapper = shallow(
      <Row
        questionnaire={questionnaire}
        onDuplicateQuestionnaire={handleDuplicateQuestionnaire}
        onDeleteQuestionnaire={handleDeleteQuestionnaire}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render as disabled when the id is a duplicate", () => {
    questionnaire.id = "dupe-2";
    const wrapper = shallow(
      <Row
        questionnaire={questionnaire}
        onDuplicateQuestionnaire={handleDuplicateQuestionnaire}
        onDeleteQuestionnaire={handleDeleteQuestionnaire}
      />,
      { disableLifecycleMethods: true }
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should auto focus when it id is a duplicate", () => {
    const focus = jest.fn();
    const getElementsByTagName = jest.fn(() => [{ focus }]);

    questionnaire.id = "dupe-2";
    const wrapper = shallow(
      <Row
        questionnaire={questionnaire}
        onDuplicateQuestionnaire={handleDuplicateQuestionnaire}
        onDeleteQuestionnaire={handleDeleteQuestionnaire}
      />,
      { disableLifecycleMethods: true }
    );

    const instance = wrapper.instance();
    instance.rowRef = { current: { getElementsByTagName } };

    instance.componentDidMount();
    expect(getElementsByTagName).toHaveBeenCalledWith("a");
    expect(focus).toHaveBeenCalled();
  });

  it("should auto focus when it receives autofocus", () => {
    const wrapper = shallow(
      <Row
        questionnaire={questionnaire}
        onDuplicateQuestionnaire={handleDuplicateQuestionnaire}
        onDeleteQuestionnaire={handleDeleteQuestionnaire}
      />
    );
    const focus = jest.fn();
    const getElementsByTagName = jest.fn(() => [{ focus }]);
    const instance = wrapper.instance();
    instance.rowRef = { current: { getElementsByTagName } };

    wrapper.setProps({
      autoFocus: true
    });

    expect(getElementsByTagName).toHaveBeenCalled();
    expect(focus).toHaveBeenCalled();
  });

  it("should allow deletion of Questionnaire", () => {
    shallow(
      <Row
        questionnaire={questionnaire}
        onDeleteQuestionnaire={handleDeleteQuestionnaire}
        onDuplicateQuestionnaire={handleDuplicateQuestionnaire}
      />
    )
      .find(IconButtonDelete)
      .simulate("click");

    expect(handleDeleteQuestionnaire).toHaveBeenCalledWith(questionnaire.id);
  });

  it("should allow duplication of a Questionnaire", () => {
    const wrapper = shallow(
      <Row
        questionnaire={questionnaire}
        onDeleteQuestionnaire={handleDeleteQuestionnaire}
        onDuplicateQuestionnaire={handleDuplicateQuestionnaire}
      />
    );

    wrapper.find(DuplicateButton).simulate("click");

    expect(handleDuplicateQuestionnaire).toHaveBeenCalledWith(questionnaire);
  });

  it("should not re-render if the props we care about dont change", () => {
    const wrapper = shallow(
      <Row
        questionnaire={questionnaire}
        onDeleteQuestionnaire={handleDeleteQuestionnaire}
        onDuplicateQuestionnaire={handleDuplicateQuestionnaire}
      />
    );
    expect(
      wrapper.instance().shouldComponentUpdate({
        questionnaire,
        onDeleteQuestionnaire: handleDeleteQuestionnaire,
        onDuplicateQuestionnaire: handleDuplicateQuestionnaire,
        foo: "bar"
      })
    ).toBeFalsy();
  });
});
