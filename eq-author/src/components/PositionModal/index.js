import React from "react";
import PropTypes from "prop-types";
import ItemSelectModal from "components/ItemSelectModal";
import ItemSelect, { Option } from "components/ItemSelectModal/ItemSelect";
import { reject, uniqueId } from "lodash";
import Icon from "assets/icon-select.svg";
import styled from "styled-components";

import { colors, radius } from "constants/theme";

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
  padding: 0.5rem 2em 0.5rem 0.5rem;
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

const moveTo = (array, item, position) => {
  array = reject(array, { id: item.id });
  array.splice(position, 0, item);
  return array;
};

class PositionModal extends React.Component {
  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
        position: PropTypes.number.isRequired
      })
    ).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    selected: PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
      position: PropTypes.number.isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      selectedPosition: props.selected.position,
      previousSelectedPosition: props.selected.position
    };
  }

  handleClose = () => {
    const { previousSelectedPosition } = this.state;

    this.setState({
      isOpen: false,
      selectedPosition: previousSelectedPosition
    });
  };

  handleOpen = () => {
    this.setState({
      isOpen: true
    });
  };

  handleChange = ({ value }) => {
    this.setState({ selectedPosition: parseInt(value, 10) });
  };

  handleConfirm = e => {
    const { onMove } = this.props;
    const { selectedPosition } = this.state;
    e.preventDefault();
    this.setState({ isOpen: false }, () => onMove(selectedPosition));
  };

  getOrderedOptions() {
    const { selected, options } = this.props;
    const { selectedPosition } = this.state;

    return moveTo(options, selected, selectedPosition);
  }

  renderPositionSelect(data) {
    const { isOpen, selectedPosition } = this.state;

    return (
      <ItemSelectModal
        data-test={"position-select-modal"}
        title={"Position"}
        primaryText={"Move"}
        isOpen={isOpen}
        onClose={this.handleClose}
        onConfirm={this.handleConfirm}
      >
        <ItemSelect
          data-test={"position-item-select"}
          name={"position"}
          value={String(selectedPosition)}
          onChange={this.handleChange}
        >
          {data.map((item, i) => (
            <Option key={i} value={String(i)}>
              {item.displayName}
            </Option>
          ))}
        </ItemSelect>
      </ItemSelectModal>
    );
  }

  render() {
    const options = this.getOrderedOptions();
    const positionButtonId = uniqueId("PositionModal");
    return (
      <div data-test={"position-modal"}>
        <Label htmlFor={positionButtonId}>Position</Label>
        <Trigger
          data-test="position-modal-trigger"
          id={positionButtonId}
          onClick={this.handleOpen}
        >
          Select
        </Trigger>
        {this.renderPositionSelect(options)}
      </div>
    );
  }
}

export default PositionModal;
