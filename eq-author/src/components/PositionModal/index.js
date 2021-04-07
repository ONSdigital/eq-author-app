import React, { useState } from "react";
import PropTypes from "prop-types";
import { uniqueId } from "lodash";
import styled from "styled-components";

import { usePosition } from "./usePosition";

import ItemSelect, { Option } from "components/ItemSelectModal/ItemSelect";
import ItemSelectModal from "components/ItemSelectModal";
import Truncated from "components/Truncated";
import Icon from "assets/icon-select.svg";

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
  padding: 0.5rem;
  padding-right: 2em;
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

const PositionModal = ({ title, options, onMove, selected, onChange }) => {
  const positionButtonId = uniqueId("PositionModal");
  const [isOpen, setIsOpen] = useState(false);
  const [{ position, item }, previous, setOption] = usePosition({
    options,
    selected,
  });

  const orderedOptions = options.filter(({ id }) => id !== selected?.id);
  selected.parentEnabled = item?.parentEnabled;
  orderedOptions.splice(position, 0, selected);

  const handleClose = () => {
    setIsOpen(false);
    setOption({
      position: previous,
      item: orderedOptions[previous],
    });
  };

  const handleChange = ({ value }) => {
    const option = orderedOptions[value];
    const count =
      option?.__typename === "Folder" && value - position >= 0 // check if folder and going down
        ? orderedOptions.filter(({ parentId }) => parentId === option?.id)
            .length
        : 0;
    setOption({
      position: parseInt(value, 10) + count,
      item: option,
    });
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    // item is the element in the modal you just clicked
    const { parentId = null } = item;

    let positionCalculation = parentId
      ? orderedOptions // only show contents of selected folder
          .filter((i) => parentId === i.parentId || i.id === selected.id)
          .findIndex((item) => item.id === selected.id)
      : orderedOptions // remove all questions inside enabled folders
          .filter(({ parentId }) => !parentId)
          .findIndex((item) => item.id === selected.id);

    // onMove is conditional so it can be used as a section selector
    onMove &&
      onMove({
        ...item,
        folderId: parentId,
        position: positionCalculation,
      });

    setIsOpen(false);
  };

  return (
    <div data-test={`${title.toLowerCase()}-position-modal`}>
      <Label htmlFor={positionButtonId}>{title}</Label>
      <Trigger
        id={positionButtonId}
        onClick={() => setIsOpen(true)}
        data-test={`${title.toLowerCase()}-modal-trigger`}
      >
        <Truncated>{selected?.displayName || "Select"}</Truncated>
      </Trigger>
      <ItemSelectModal
        title={title}
        data-test={`${title.toLowerCase()}-select-modal`}
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      >
        <ItemSelect
          data-test={`${title.toLowerCase()}-item-select`}
          name={title.toLowerCase()}
          value={String(position)}
          onChange={onChange || handleChange} // onChange supplied for section selector
        >
          {orderedOptions.map(({ displayName, parentEnabled }, i) => (
            <Indent
              data-test="options"
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
  title: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
      folderId: PropTypes.string,
      parentEnabled: PropTypes.bool,
    })
  ).isRequired,
  selected: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    position: PropTypes.number,
  }).isRequired,
  onMove: PropTypes.func,
  onChange: PropTypes.func,
};

export default PositionModal;
