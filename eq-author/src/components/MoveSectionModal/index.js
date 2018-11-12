import React from "react";
import MoveModal from "components/MoveModal";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import PositionModal from "components/PositionModal";

class MoveSectionModal extends React.Component {
  static propTypes = {
    section: CustomPropTypes.section.isRequired,
    questionnaire: CustomPropTypes.questionnaire.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onMoveSection: PropTypes.func.isRequired
  };

  handleOnMove = position => {
    const { section, onMoveSection } = this.props;
    onMoveSection({
      from: {
        id: section.id,
        position: section.position
      },
      to: {
        id: section.id,
        position: position
      }
    });
  };

  render() {
    const {
      questionnaire: { sections },
      section
    } = this.props;

    return (
      <MoveModal title={"Move section"} {...this.props}>
        <PositionModal
          options={sections}
          selected={section}
          onMove={this.handleOnMove}
          {...this.props}
        />
      </MoveModal>
    );
  }
}

export default MoveSectionModal;
