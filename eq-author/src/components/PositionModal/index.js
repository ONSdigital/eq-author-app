import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import ItemSelectModal from "components/ItemSelectModal";
import ItemSelect, { Option } from "components/ItemSelectModal/ItemSelect";
import { uniqueId } from "lodash";
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
  background: ${colors.white} url('${Icon}') no-repeat right center;
  border: solid 1px ${colors.borders};
  text-align: left;
  border-radius: ${radius};
  color: ${colors.black};

  &:focus {
    box-shadow: 0 0 0 3px ${colors.tertiary}, inset 0 0 0 1px ${colors.primary};
    outline: none;
  }
`;

const PositionModal = ({ options, onMove, selected }) => {
  const previousPosition = useMemo(
    () => options.findIndex(({ id }) => id === selected.id),
    [options, selected]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(previousPosition);
  const [positionButtonId] = useState(uniqueId("PositionModal"));

  const orderedOptions = options.filter(({ id }) => id !== selected.id);
  orderedOptions.splice(selectedPosition, 0, selected);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedPosition(previousPosition);
  };

  const handleOpen = () => setIsOpen(true);

  const handleChange = ({ value }) => setSelectedPosition(parseInt(value, 10));

  const handleConfirm = e => {
    e.preventDefault();
    setIsOpen(false);
    onMove({
      position: selectedPosition,
      folderId: null,
    });
  };

  return (
    <div data-test={"position-modal"}>
      <Label htmlFor={positionButtonId}>Position</Label>
      <Trigger
        data-test="position-modal-trigger"
        id={positionButtonId}
        onClick={handleOpen}
      >
        Select
      </Trigger>
      <ItemSelectModal
        data-test={"position-select-modal"}
        title={"Position"}
        primaryText={"Move"}
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      >
        <ItemSelect
          data-test={"position-item-select"}
          name={"position"}
          value={String(selectedPosition)}
          onChange={handleChange}
        >
          {orderedOptions.map((item, i) => (
            <Option key={i} value={String(i)}>
              {item.displayName}
            </Option>
          ))}
        </ItemSelect>
      </ItemSelectModal>
    </div>
  );
};

PositionModal.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
      position: PropTypes.number.isRequired,
    })
  ).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  selected: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    position: PropTypes.number,
  }).isRequired,
};

export default PositionModal;
