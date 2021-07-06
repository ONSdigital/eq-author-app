import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import Button from "components/buttons/Button";
import IconText from "components/IconText";

import IconAddRule from "assets/icon-add-rule.svg?inline";
import IconRouting from "assets/icon-routing.svg?inline";

const Container = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  padding: 3em 0 2em;
`;

const Icon = styled(IconRouting)`
  display: block;
  margin: 0 auto 0.5em;
`;

const AddDisplayButton = styled(Button)`
  margin: 2em auto 1em;
  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.6;
    `}
`;

const NoDisplayLogic = ({
  onAddDisplay,
  disabled = false,
  children,
  ...otherProps
}) => (
  <Container {...otherProps}>
    <Icon />
    {children}
    <AddDisplayButton
      small
      variant="primary"
      data-test="btn-add-display"
      disabled={disabled}
      onClick={onAddDisplay}
    >
      <IconText icon={IconAddRule}>Add display logic</IconText>
    </AddDisplayButton>
  </Container>
);

NoDisplayLogic.propTypes = {
  onAddDisplay: PropTypes.object, //eslint-disable-line
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default NoDisplayLogic;
