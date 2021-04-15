import React from "react";
import styled from "styled-components";
import { colors } from "constants/theme";
import PropTypes from "prop-types";
import VisuallyHidden from "components/VisuallyHidden";
import IconMoveIndicator from "components/ItemSelectModal/icon-move-indicator.svg?inline";
import { uniqueId } from "lodash";
import withChangeHandler from "components/Forms/withChangeHandler";
import IconText from "components/IconText";
import Truncated from "components/Truncated";

const Input = VisuallyHidden.withComponent("input");
Input.defaultProps = {
  type: "radio",
};

const Label = styled.label`
  display: flex;
  align-items: center;
  padding: 0;
  position: relative;

  --icon-color: rgba(255, 255, 255, 0);

  svg {
    path {
      fill: var(--icon-color);
    }
  }

  &:hover {
    background-color: ${colors.lighterGrey};
  }

  ${/* sc-sel */ Input}:focus + & {
    outline: 3px solid ${colors.tertiary};
    outline-offset: -3px;
  }

  ${/* sc-sel */ Input}:checked + & {
    background-color: ${colors.blue};
    color: ${colors.white};

    --icon-color: rgba(255, 255, 255, 1);
  }
`;

const IndentIcon = styled(IconText)`
  padding-left: ${({ indent }) => (indent === "true" ? 1 : 0)}em;
`;

export const Option = ({
  name,
  selected,
  value,
  onChange,
  id = uniqueId("ItemList_Option"),
  children,
  ...otherProps
}) => (
  <div {...otherProps}>
    <Input
      value={value}
      id={id}
      onChange={onChange}
      checked={selected}
      name={name}
    />
    <Label selected={selected} htmlFor={id}>
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
