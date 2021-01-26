import React from "react";
import { shallow } from "enzyme";
import { render, fireEvent } from "tests/utils/rtl";

import IconButtonDelete from "components/buttons/IconButtonDelete";
import DeleteConfirmDialog from "components/DeleteConfirmDialog";

import { colors } from "constants/theme";
import { UNPUBLISHED } from "constants/publishStatus";

import {
  Row,
  TR,
  ShortTitle,
  DuplicateQuestionnaireButton,
  QuestionnaireLink,
} from "./";

// const mockQuestionnaire = buildQuestionnaire({ sectionCount: 2 });


describe("Row", () => {
  let props;

  const renderRow = props =>
    render(
      <table>
        <tbody>
          <Row {...props} />
        </tbody>
      </table>
    );

  beforeEach(() => {
    // wrapper = shallow(
    //   <Row
    //   onDeleteQuestionnaire={jest.fn()}
    //   onDuplicateQuestionnaire={jest.fn()}
    //   history={jest.fn()}
    //   questionnaire={mockQuestionnaire}
    //   />
    // );

    props = {
      onDeleteQuestionnaire: jest.fn(),
      onDuplicateQuestionnaire: jest.fn(),
      history: {
        push: jest.fn(),
      },
      questionnaire: {
        id: "1",
        displayName: "Foo",
        shortTitle: "Test title",
        createdAt: "2017/01/02",
        updatedAt: "2017/01/03",
        publishStatus: UNPUBLISHED,
        sections: [
          {
            id: "1",
            pages: [{ id: "1" }],
          },
        ],
        createdBy: {
          name: "Alan",
          email: "Alan@Hello.com",
          displayName: "Alan",
        },
      },
    };
  });

  it("should render", () => {
    const { getByText } = renderRow(props);
    expect(getByText("Test title")).toBeTruthy();
  });

  // it("should auto focus when it receives autofocus", () => {
  //   const wrapper = shallow(<Row {...props} />);

  //   const focus = jest.fn();
  //   const getElementsByTagName = jest.fn(() => [{ focus }]);
  //   const instance = wrapper.instance();
  //   instance.rowRef = { current: { getElementsByTagName } };

  //   wrapper.setProps({
  //     autoFocus: true,
  //   });

  //   expect(getElementsByTagName).toHaveBeenCalled();
  //   expect(focus).toHaveBeenCalled();
  // });

  it("should handle row focus state change correctly", () => {
    const { getByTestId } = renderRow(props);
    const row = getByTestId("table-row");
    fireEvent.focus(row);
    expect(row).toHaveStyleRule("border-color", `${colors.tertiary}`);
    fireEvent.blur(row);
    expect(row).not.toHaveStyleRule("border-color", `${colors.tertiary}`);
  });

  it("should handle button focus state change correctly", () => {
    const wrapper = shallow(<Row {...props} />);
    
    const tableRow = wrapper.find(TR);
    const actionButton = wrapper.find("[data-test='action-btn-group']");
    const stopPropagation = jest.fn();

    tableRow.simulate("focus");
    expect(wrapper.find("linkHasFocus")).toBeTruthy();
    actionButton.simulate("focus", {
      stopPropagation,
    });
    expect(stopPropagation).toHaveBeenCalled();
  });

  it("should navigate to the questionnaire when the row is clicked", () => {
    const wrapper = shallow(<Row {...props} />);

    const tableRow = wrapper.find(TR);
    tableRow.simulate("click");
    expect(props.history.push).toHaveBeenCalled();
  });

  it("should only navigate to the questionnaire once when clicking the link", () => {
    const wrapper = shallow(<Row {...props} />);
    const tableLink = wrapper.find(QuestionnaireLink);
    const stopPropagation = jest.fn();
    tableLink.simulate("click", { stopPropagation });
    expect(stopPropagation).toHaveBeenCalled();
  });

  // it("should only grab focus once", () => {
  //   const wrapper = shallow(<Row {...props} />);

  //   const focus = jest.fn();
  //   const getElementsByTagName = jest.fn(() => [{ focus }]);
  //   const instance = wrapper.instance();
  //   instance.rowRef = { current: { getElementsByTagName } };

  //   wrapper.setProps({
  //     autoFocus: true,
  //   });

  //   wrapper.setProps({
  //     autoFocus: true,
  //   });

  //   expect(focus).toHaveBeenCalledTimes(1);
  // });

  it("should allow duplication of a Questionnaire", () => {
    let wrapper = shallow(<Row {...props} />);
    const stopPropagation = jest.fn();
    wrapper
      .find(DuplicateQuestionnaireButton)
      .simulate("click", { stopPropagation });

    expect(props.onDuplicateQuestionnaire).toHaveBeenCalledWith(
      props.questionnaire
    );
    expect(stopPropagation).toHaveBeenCalled();
  });

  it("should show the short title when it is provided", () => {
    let wrapper = shallow(<Row {...props} />);

    const shortTitle = wrapper.find(ShortTitle);
    expect(shortTitle).toMatchSnapshot();
    props.questionnaire.shortTitle = "";
    wrapper = shallow(<Row {...props} />);
    expect(wrapper.find(ShortTitle)).toHaveLength(0);
  });

  describe("deletion", () => {
    it("should show the confirm delete dialog when the delete button is clicked", () => {
      const wrapper = shallow(<Row {...props} />);
      const stopPropagation = jest.fn();
      wrapper.find(IconButtonDelete).simulate("click", { stopPropagation });

      expect(wrapper.find(DeleteConfirmDialog).props()).toMatchObject({
        isOpen: true,
      });
      expect(stopPropagation).toHaveBeenCalled();
    });

    it("should call onDelete when the dialog is confirmed", () => {
      const wrapper = shallow(<Row {...props} />);
      const stopPropagation = jest.fn();
      wrapper.find(IconButtonDelete).simulate("click", { stopPropagation });
      wrapper.find(DeleteConfirmDialog).simulate("delete");
      expect(props.onDeleteQuestionnaire).toHaveBeenCalledWith(
        props.questionnaire
      );
      expect(wrapper.find(DeleteConfirmDialog).props()).toMatchObject({
        isOpen: false,
      });
    });

    it("should hide the dialog and not call delete when the dialog is closed", () => {
      const wrapper = shallow(<Row {...props} />);
      const stopPropagation = jest.fn();
      wrapper.find(IconButtonDelete).simulate("click", { stopPropagation });
      wrapper.find(DeleteConfirmDialog).simulate("close");
      expect(props.onDeleteQuestionnaire).not.toHaveBeenCalled();
      expect(wrapper.find(DeleteConfirmDialog).props()).toMatchObject({
        isOpen: false,
      });
    });
  });
});
