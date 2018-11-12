import React from "react";
import { shallow } from "enzyme";

import PositionModal from "components/PositionModal";
import MoveSectionModal from "components/MoveSectionModal";

import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

const createWrapper = (props = {}, render = shallow) =>
  render(<MoveSectionModal {...props} />);

describe("MoveSectionModal", () => {
  let questionnaire, section, props, wrapper;

  beforeEach(() => {
    questionnaire = buildQuestionnaire();
    section = questionnaire.sections[0];
    props = {
      questionnaire,
      section,
      onClose: jest.fn(),
      onMoveSection: jest.fn(),
      isOpen: true
    };
    wrapper = createWrapper(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("correctly handles onMove", () => {
    const position = 7;

    wrapper.find(PositionModal).simulate("move", position);

    expect(props.onMoveSection).toHaveBeenCalledWith({
      from: {
        id: section.id,
        position: section.position
      },
      to: {
        id: section.id,
        position: position
      }
    });
  });

  it("correctly handles onClose", () => {
    wrapper.simulate("close");
    expect(props.onClose).toHaveBeenCalled();
  });
});
