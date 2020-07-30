import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { TransitionGroup } from "react-transition-group";
import { uniqueId } from "lodash";

import FadeTransition from "components/transitions/FadeTransition";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import { Field } from "components/Forms";

const InlineField = styled(Field)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0;
`;

const Container = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`;

const ValidationContainer = styled(Container)`
  padding: 1em 0;
`;

class ValidationView extends Component {
  renderChildren = () => (
    <ValidationContainer>{this.props.children}</ValidationContainer>
  );

  render() {
    const { enabled, onToggleChange, ...otherProps } = this.props;
    const id = uniqueId("ValidationView");

    return (
      <Container {...otherProps}>
        <InlineField data-test="validation-view-toggle">
          <ToggleSwitch
            id={id}
            name={id}
            onChange={onToggleChange}
            checked={enabled}
            hideLabels={false}
          />
        </InlineField>

        <TransitionGroup>
          <FadeTransition
            key={`validation-enabled-${enabled}`}
            enter
            exit={false}
          >
            {this.renderChildren()}
          </FadeTransition>
        </TransitionGroup>
      </Container>
    );
  }
}

ValidationView.propTypes = {
  children: PropTypes.node.isRequired,
  enabled: PropTypes.bool.isRequired,
  onToggleChange: PropTypes.func.isRequired,
};

export default ValidationView;
