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

export const Title = styled.h2`
  font-size: 1.8em;
  font-weight: 600;
  margin-bottom: 0.5em;
`;

export const Paragraph = styled.p`
  margin: 0;
`;

const AddRoutingButton = styled(Button)`
  margin: 2em auto 1em;
  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.6;
    `}
`;

const RoutingRuleSetMsg = ({
  onAddRouting,
  disabled = false,
  children,
  ...otherProps
}) => (
  <Container {...otherProps}>
    <Icon />
    {children}
    <AddRoutingButton
      small
      naked
      variant="primary"
      onClick={onAddRouting}
      data-test="btn-add-routing"
      disabled={disabled}
    >
      <IconText icon={IconAddRule}>Add your first rule</IconText>
    </AddRoutingButton>
  </Container>
);

RoutingRuleSetMsg.propTypes = {
  onAddRouting: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default RoutingRuleSetMsg;
