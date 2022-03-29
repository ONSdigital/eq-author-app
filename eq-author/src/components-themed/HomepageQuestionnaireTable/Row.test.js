import React from "react";
import { shallow } from "enzyme";
import { render, fireEvent } from "tests/utils/rtl";

import * as Headings from "constants/table-headings";
import DeleteConfirmDialog from "components/DeleteConfirmDialog";

import { colors } from "constants/theme";
import { UNPUBLISHED } from "constants/publishStatus";

import { Row, TR, ShortTitle, DuplicateIconButton, DeleteButton } from "./row";

import { useMutation } from "@apollo/react-hooks";

jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(() => [() => null]),
}));

const enabledRows = [
  Headings.TITLE,
  Headings.OWNER,
  Headings.CREATED,
  Headings.MODIFIED,
  Headings.LOCKED,
  Headings.STARRED,
  Headings.ACCESS,
  Headings.ACTIONS,
];

describe("Row", () => {
  let props;

  const renderRow = (props) =>
    render(
      <table>
        <tbody>
          <Row {...props} />
        </tbody>
      </table>
    );

  beforeEach(() => {
    props = {
      onDeleteQuestionnaire: jest.fn(),
      onDuplicateQuestionnaire: jest.fn(),
      onLockQuestionnaire: jest.fn(),
      tableHeadings: enabledRows,
      history: {
        push: jest.fn(),
      },
      onClick: jest.fn(),
      questionnaire: {
        id: "1",
        displayName: "Foo",
        shortTitle: "Test title",
        createdAt: "2022/01/02",
        updatedAt: "2022/01/03",
        publishStatus: UNPUBLISHED,
        locked: false,
        permission: "Write",
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

  it("should call onClick when questionnaire link is clicked", () => {
    const wrapper = shallow(<Row {...props} />);

    const questionnaire = wrapper.find(
      "[data-test='anchor-questionnaire-title']"
    );
    questionnaire.simulate("click");

    expect(props.onClick).toHaveBeenCalledWith(props.questionnaire.id);
  });

  it("should allow duplication of a Questionnaire", () => {
    let wrapper = shallow(<Row {...props} />);
    const stopPropagation = jest.fn();
    wrapper.find(DuplicateIconButton).simulate("click", { stopPropagation });

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

  describe("starring questionnaires", () => {
    it("should call mutation to toggle star status when star button pressed", () => {
      const mockMutation = jest.fn();
      useMutation.mockImplementation(() => [mockMutation]);
      const wrapper = shallow(<Row {...props} />);
      wrapper
        .find("[data-test='starButton']")
        .simulate("click", { stopPropagation: jest.fn() });
      expect(mockMutation).toHaveBeenCalledTimes(1);
    });
  });

  describe("locking questionnaires", () => {
    it("should pass questionnaire info to parent when lock button pressed", () => {
      const wrapper = shallow(<Row {...props} />);
      wrapper
        .find("[data-test='lockButton']")
        .simulate("click", { stopPropagation: jest.fn() });
      expect(props.onLockQuestionnaire).toHaveBeenCalledWith(
        expect.objectContaining({
          id: props.questionnaire.id,
          locked: props.questionnaire.locked,
        })
      );
    });
  });

  describe("access questionnaires", () => {
    it("should display Editor when permission is WRITE", () => {
      const { getByText } = renderRow(props);
      expect(getByText("Editor")).toBeTruthy();
    });
  });

  describe("deletion", () => {
    it("should show the confirm delete dialog when the delete button is clicked", () => {
      const wrapper = shallow(<Row {...props} />);
      const stopPropagation = jest.fn();
      wrapper.find(DeleteButton).simulate("click", { stopPropagation });

      expect(wrapper.find(DeleteConfirmDialog).props()).toMatchObject({
        isOpen: true,
      });
      expect(stopPropagation).toHaveBeenCalled();
    });

    it("should call onDelete when the dialog is confirmed", () => {
      const wrapper = shallow(<Row {...props} />);
      const stopPropagation = jest.fn();
      wrapper.find(DeleteButton).simulate("click", { stopPropagation });
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
      wrapper.find(DeleteButton).simulate("click", { stopPropagation });
      wrapper.find(DeleteConfirmDialog).simulate("close");
      expect(props.onDeleteQuestionnaire).not.toHaveBeenCalled();
      expect(wrapper.find(DeleteConfirmDialog).props()).toMatchObject({
        isOpen: false,
      });
    });
  });
});
