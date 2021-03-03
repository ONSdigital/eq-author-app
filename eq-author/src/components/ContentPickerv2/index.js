import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import Modal, { CloseButton } from "components/modals/Modal";
import Button from "components/buttons/Button";
import ButtonGroup from "components/buttons/ButtonGroup";
import {
  ANSWER,
  METADATA,
  VARIABLES,
  DESTINATION,
} from "components/ContentPickerSelect/content-types";
import AnswerPicker from "./AnswerPicker";
import MetadataPicker from "./MetadataPicker";
import VariablePicker from "./VariablePicker";
import DestinationPicker from "./DestinationPicker";

const ModalFooter = styled.div`
  padding: 1.5em;
  border-top: 1px solid ${colors.bordersLight};
`;

export const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  right: 0.5em;
  top: 2em;
  bottom: 0;
  margin: auto;
  align-items: center;
`;

const StyledModal = styled(Modal)`
  .Modal {
    padding: 0;
    width: 45em;
  }
`;

const Container = styled.div`
  background: white;
`;

const ContentPicker = ({
  contentType,
  data,
  onOpen,
  onClose,
  isOpen,
  startingSelectedAnswers,
  multiselect,
  onSubmit,
}) => {
  const [selectedItems, setSelectedItems] = useState(
    startingSelectedAnswers || []
  );

  const isSelected = (item) =>
    selectedItems.findIndex((selectedItem) => selectedItem.id === item.id) !==
    -1;

  const getFirstSelectedItemId = () => {
    if (!selectedItems.length) {
      return "";
    }

    return selectedItems[0].id;
  };

  const updateSelectedItemsSingle = (item) => {
    const updatedSelectedItems =
      !item ||
      (Object.keys(item).length === 1 && item.hasOwnProperty("pipingType")) ||
      isSelected(item)
        ? []
        : [item];
    setSelectedItems(updatedSelectedItems);
  };

  const updateSelectedItemsMultiple = (item) => {
    let updatedSelectedItems;
    if (!item) {
      updatedSelectedItems = selectedItems;
    } else {
      updatedSelectedItems = isSelected(item)
        ? selectedItems.filter((selectedItem) => selectedItem.id !== item.id)
        : [...selectedItems, item];
    }

    setSelectedItems(updatedSelectedItems);
  };

  const handleConfirm = () => {
    if (multiselect) {
      onSubmit(selectedItems);
    } else {
      onSubmit(selectedItems[0]);
    }
  };

  const handleSelected = multiselect
    ? updateSelectedItemsMultiple
    : updateSelectedItemsSingle;

  const renderPicker = () => {
    switch (contentType) {
      case METADATA:
        return (
          <MetadataPicker
            onConfirm={handleConfirm}
            onSelected={(item) =>
              handleSelected({ ...item, pipingType: "metadata" })
            }
            isSelected={isSelected}
            data={data}
          />
        );

      case ANSWER:
        return (
          <AnswerPicker
            onConfirm={handleConfirm}
            onSelected={(item) =>
              handleSelected({ ...item, pipingType: "answers" })
            }
            isSelected={isSelected}
            data={data}
            multiselect={multiselect}
            firstSelectedItemId={getFirstSelectedItemId()}
          />
        );

      case VARIABLES:
        return (
          <VariablePicker
            onConfirm={handleConfirm}
            onSelected={(item) =>
              handleSelected({ ...item, pipingType: "variable" })
            }
            isSelected={isSelected}
            data={data}
          />
        );

      case DESTINATION:
        return (
          <DestinationPicker
            onConfirm={handleConfirm}
            onSelected={(item) => handleSelected(item)}
            isSelected={isSelected}
            data={data}
          />
        );

      default:
        return <div data-test="content-picker-empty" />;
    }
  };

  return (
    <StyledModal
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      hasCloseButton
    >
      <Container>{renderPicker()}</Container>
      <ModalFooter>
        <ButtonGroup horizontal align="right">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            autoFocus
            onClick={handleConfirm}
            disabled={!selectedItems.length}
          >
            Confirm
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </StyledModal>
  );
};

ContentPicker.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      })
    ),
  ]),
  startingSelectedAnswers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ),
  singleItemSelect: PropTypes.bool,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  contentType: PropTypes.string,
  multiselect: PropTypes.bool,
};

export default ContentPicker;
