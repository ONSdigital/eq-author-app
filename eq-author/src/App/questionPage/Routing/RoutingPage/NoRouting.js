import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Button from "components/buttons/Button";
import IconText from "components/IconText";

import IconAddRule from "../icon-add-rule.svg?inline";
import IconRouting from "./icon-routing.svg?inline";

const Container = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  padding: 1em 0;
  margin-bottom: 0;
`;

const Icon = styled(IconRouting)`
  display: block;
  margin: 0 auto 0.5em;
`;

const Title = styled.h2`
  font-size: 1.8em;
  font-weight: 600;
  margin-bottom: 0.5em;
`;

const Paragraph = styled.p`
  margin: 0;
`;

const AddRoutingButton = styled(Button)`
  margin: 2em auto 1em;
`;

const RoutingRuleSetMsg = ({
  title,
  onAddRouting,
  children,
  ...otherProps
}) => (
  <Container {...otherProps}>
    <Icon />
    <Title>{title}</Title>
    <Paragraph>{children}</Paragraph>
    <AddRoutingButton
      small
      naked
      variant="primary"
      onClick={onAddRouting}
      data-test="btn-add-routing"
    >
      <IconText icon={IconAddRule}>Add your first rule</IconText>
    </AddRoutingButton>
  </Container>
);

RoutingRuleSetMsg.propTypes = {
  title: PropTypes.string.isRequired,
  onAddRouting: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default RoutingRuleSetMsg;
