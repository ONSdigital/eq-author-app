import React from "react";
import styled from "styled-components";
import { colors } from "constants/theme";
import PropTypes from "prop-types";
import { uniqueId } from "lodash";

import VisuallyHidden from "components/VisuallyHidden";
import { ReactComponent as IconMoveIndicator } from "components/ItemSelectModal/icon-move-indicator.svg";
import withChangeHandler from "components/Forms/withChangeHandler";
import IconText from "components/IconText";
import Truncated from "components/Truncated";

import isListCollectorPageType from "utils/isListCollectorPageType";

import {
  CalculatedSummaryPage,
  ListCollectorQualifierPage,
  ListCollectorAddItemPage,
  ListCollectorConfirmationPage,
} from "constants/page-types";

const Input = VisuallyHidden.withComponent("input");
Input.defaultProps = {
  type: "radio",
};

const Label = styled.label`
  display: flex;
  align-items: center;
  padding: 0;
  position: relative;
  ${(props) => props.disabled && "opacity: 0.6;"}

  --icon-color: rgba(255, 255, 255, 0);

  svg {
    path {
      fill: var(--icon-color);
    }
  }

  &:hover {
    background-color: ${colors.lighterGrey};
  }

  ${Input}:focus + & {
    outline: 3px solid ${colors.tertiary};
    outline-offset: -3px;
  }

  ${Input}:checked + & {
    background-color: ${colors.blue};
    color: ${colors.white};

    svg,
    path,
    g,
    polygon {
      fill: ${colors.white};
    }
  }
`;

const IndentIcon = styled(IconText)`
  padding-left: ${({ indent }) => (indent === "true" ? 1 : 0)}em;
`;

const isOptionDisabled = (
  pageType,
  isListCollectorFolder,
  selectedItemPosition,
  index,
  selectedItem,
  entityToMove,
  repeatingSection
) => {
  if (isListCollectorFolder || isListCollectorPageType(pageType)) {
    if (
      selectedItem?.pageType === CalculatedSummaryPage ||
      selectedItem?.confirmation
    ) {
      return true;
    }
  }
  if (
    pageType === ListCollectorQualifierPage ||
    pageType === ListCollectorConfirmationPage
  ) {
    return true;
  }
  if (pageType === ListCollectorAddItemPage && selectedItemPosition > index) {
    return true;
  }
  if (repeatingSection && entityToMove.listId != null) {
    return true;
  }
  return false;
};

export const Option = ({
  name,
  selected,
  value,
  onChange,
  id = uniqueId("ItemList_Option"),
  children,
  pageType,
  isListCollectorFolder,
  selectedItem,
  entityToMove,
  repeatingSection,
  selectedItemPosition,
  index,
  ...otherProps
}) => (
  <div {...otherProps}>
    <Input
      value={value}
      id={id}
      onChange={onChange}
      checked={selected}
      name={name}
      disabled={isOptionDisabled(
        pageType,
        isListCollectorFolder,
        selectedItemPosition,
        index,
        selectedItem,
        entityToMove,
        repeatingSection
      )}
    />
    <Label
      disabled={isOptionDisabled(
        pageType,
        isListCollectorFolder,
        selectedItemPosition,
        index,
        selectedItem,
        entityToMove,
        repeatingSection
      )}
      selected={selected}
      htmlFor={id}
      data-test={`option-label-${value}`}
    >
      <IndentIcon icon={IconMoveIndicator}>
        <Truncated>{children}</Truncated>
      </IndentIcon>
    </Label>
  </div>
);

Option.propTypes = {
  selected: PropTypes.bool,
  value: PropTypes.string.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  pageType: PropTypes.string,
  selectedItemPosition: PropTypes.number,
  index: PropTypes.number,
  isListCollectorFolder: PropTypes.bool,
  /**
   * The item selected (highlighted) in the modal.
   */
  selectedItem: PropTypes.object, // eslint-disable-line
  /**
   * The item to be moved.
   */
  entityToMove: PropTypes.object, // eslint-disable-line
  repeatingSection: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

const ItemSelect = ({ children, value, name, onChange, ...otherProps }) => (
  <div {...otherProps}>
    {React.Children.map(children, (child) =>
      React.cloneElement(child, {
        onChange,
        name,
        selected: child.props.value === value,
      })
    )}
  </div>
);

ItemSelect.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default withChangeHandler(ItemSelect);
