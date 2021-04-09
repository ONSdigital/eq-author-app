import React, { useState, useEffect, useRef } from "react";
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
  background: ${colors.white} url("${Icon}") no-repeat right center;
  border: solid 1px ${colors.borders};
  text-align: left;
  border-radius: ${radius};
  color: ${colors.black};

  &:focus {
    box-shadow: 0 0 0 3px ${colors.tertiary}, inset 0 0 0 1px ${colors.primary};
    outline: none;
  }
`;

const Indent = styled(Option)`
  margin-left: ${({ indent }) => (indent ? 1 : 0)}em;
`;

const PositionModal = ({ options, onMove, selected }) => {
  const positionButtonId = uniqueId("PositionModal");
  const [isOpen, setIsOpen] = useState(false);
  const previousIndex = options.findIndex(({ id }) => id === selected.id);
  const previousPosition = useRef(previousIndex > -1 ? previousIndex : 0);
  const [{ position, item }, setOption] = useState({
    position: previousPosition.current,
    item: options[previousPosition.current],
  });

  useEffect(() => {
    // resets the position of the selected item when changing sections
    const previousIndex = options.findIndex(({ id }) => id === selected.id);
    previousPosition.current = previousIndex > -1 ? previousIndex : 0;
    setOption((prev) => ({ ...prev, position: previousPosition.current }));
  }, [options, selected]);

  const orderedOptions = options.filter(({ id }) => id !== selected.id);
  selected.parentEnabled = item?.parentEnabled;
  orderedOptions.splice(position, 0, selected);

  const handleClose = () => {
    setIsOpen(false);
    setOption({
      position: previousPosition.current,
      item: orderedOptions[previousPosition.current],
    });
  };

  const handleChange = ({ value }) => {
    const filteredOptions = orderedOptions.filter(
            ({ parentId }) => parentId === orderedOptions[value].id
          );
          
    const count =
      orderedOptions[value].__typename === "Folder" && value - position >= 0
        ? filteredOptions.length : 0;
    setOption({
      position: parseInt(value, 10) + count,
      item: orderedOptions[value],
    });
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    // item is the element in the modal you just clicked
    const { parentId = null } = item;

    let positionCalculation;

    if (parentId) {
      // get pages in target folder + selected item
      const selectedItemPosition = orderedOptions
        .filter(
          ({ parentId: itemId, id }) =>
            parentId === itemId || id === selected.id
        )
        .findIndex(({ id }) => id === selected.id);
      positionCalculation = selectedItemPosition;
    } else {
      // remove all nested pages
      const selectedItemPosition = orderedOptions
        .filter(({ parentId }) => !parentId)
        .findIndex(({ id }) => id === selected.id);
      positionCalculation = selectedItemPosition;
    }

    onMove({
      folderId: parentId,
      position: positionCalculation,
    });
    setIsOpen(false);
  };

  return (
    <div data-test="position-modal">
      <Label htmlFor={positionButtonId}>Position</Label>

      <Trigger
        data-test="position-modal-trigger"
        id={positionButtonId}
        onClick={() => setIsOpen(true)}
      >
        Select
      </Trigger>
      <ItemSelectModal
        data-test="position-select-modal"
        title="Position"
        primaryText="Move"
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      >
        <ItemSelect
          data-test="position-item-select"
          name="position"
          value={String(position)}
          onChange={handleChange}
        >
          {orderedOptions.map(({ displayName, parentEnabled }, i) => (
            <Indent
              data-test={`option-${i}`}
              key={i}
              value={String(i)}
              indent={parentEnabled ? parentEnabled.toString() : undefined}
            >
              {displayName}
            </Indent>
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
      folderId: PropTypes.string,
      parentEnabled: PropTypes.bool,
    })
  ).isRequired,
  onMove: PropTypes.func.isRequired,
  selected: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    position: PropTypes.number,
  }).isRequired,
};

export default PositionModal;
