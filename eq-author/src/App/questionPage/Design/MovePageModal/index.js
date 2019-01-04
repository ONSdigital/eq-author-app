import React from "react";
import styled from "styled-components";
import MoveModal from "components/MoveModal";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import PositionModal from "components/PositionModal";
import ItemSelectModal from "components/ItemSelectModal";
import ItemSelect, { Option } from "components/ItemSelectModal/ItemSelect";
import { find, uniqueId } from "lodash";
import Icon from "assets/icon-select.svg";

import { colors, radius } from "constants/theme";
import Truncated from "components/Truncated";

const Label = styled.label`
  display: block;
  font-size: 1em;
  font-weight: bold;
  margin-bottom: 0.25rem;
  margin-top: 1.25rem;
`;

const Trigger = styled.button.attrs({ type: "button" })`
  width: 100%;
  font-size: 1em;
  padding: 0.5rem;
  padding-right: 2em;
  background: white url('${Icon}') no-repeat right center;
  border: solid 1px #aeaeae;
  text-align: left;
  border-radius: ${radius};
  color: ${colors.black};

  &:focus {
    box-shadow: 0 0 0 3px ${colors.tertiary}, inset 0 0 0 1px ${colors.primary};
    outline: none;
  }
`;

class MovePageModal extends React.Component {
  static propTypes = {
    sectionId: PropTypes.string.isRequired,
    page: CustomPropTypes.page,
    questionnaire: CustomPropTypes.questionnaire.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onMovePage: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isSectionSelectOpen: false,
      selectedSectionId: props.sectionId,
      previousSelectedSectionId: null
    };
  }

  handleCloseSectionSelect = () => {
    this.setState({
      isSectionSelectOpen: false,
      selectedSectionId: this.state.previousSelectedSectionId
    });
  };

  handleOpenSectionSelect = () => {
    this.setState({
      isSectionSelectOpen: true,
      previousSelectedSectionId: this.state.selectedSectionId
    });
  };

  handleSectionChange = ({ value }) => {
    this.setState({
      selectedSectionId: value
    });
  };

  handleSectionConfirm = e => {
    e.preventDefault();
    this.setState({
      isSectionSelectOpen: false
    });
  };

  getSelectedSection() {
    const { questionnaire } = this.props;
    const { selectedSectionId } = this.state;

    return find(questionnaire.sections, { id: selectedSectionId });
  }

  handlePageMove = position => {
    const { page, onMovePage, sectionId } = this.props;
    const { selectedSectionId } = this.state;

    onMovePage({
      from: {
        id: page.id,
        sectionId: sectionId,
        position: page.position
      },
      to: {
        id: page.id,
        sectionId: selectedSectionId,
        position: position
      }
    });
  };

  renderSectionSelect(section) {
    const { questionnaire } = this.props;
    const { isSectionSelectOpen } = this.state;

    return (
      <ItemSelectModal
        title="Section"
        data-test={"section-select-modal"}
        isOpen={isSectionSelectOpen}
        onClose={this.handleCloseSectionSelect}
        onConfirm={this.handleSectionConfirm}
      >
        <ItemSelect
          data-test="section-item-select"
          name="section"
          value={section.id}
          onChange={this.handleSectionChange}
        >
          {questionnaire.sections.map(section => (
            <Option key={section.id} value={section.id}>
              {section.displayName}
            </Option>
          ))}
        </ItemSelect>
      </ItemSelectModal>
    );
  }

  render() {
    const { page } = this.props;
    const selectedSection = this.getSelectedSection();
    const sectionButtonId = uniqueId("MovePageModal");

    return (
      <MoveModal title={"Move question"} {...this.props}>
        <Label htmlFor={sectionButtonId}>Section</Label>
        <Trigger id={sectionButtonId} onClick={this.handleOpenSectionSelect}>
          <Truncated>{selectedSection.displayName}</Truncated>
        </Trigger>
        {this.renderSectionSelect(selectedSection)}

        <PositionModal
          data-test={"page-position-modal"}
          options={selectedSection.pages}
          onMove={this.handlePageMove}
          selected={page}
          {...this.props}
        />
      </MoveModal>
    );
  }
}

export default MovePageModal;
