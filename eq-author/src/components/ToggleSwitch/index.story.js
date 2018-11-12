import React from "react";
import { storiesOf } from "@storybook/react";
import ToggleSwitch from "./index";
import styled from "styled-components";
import PropTypes from "prop-types";
import Label from "components/Forms/Label";

const StoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Wrapper = styled.div`
  width: 20em;
`;

const InlineField = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6em;
`;

class StatefulToggleSwitch extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      value: false
    };
  }

  handleChange = ({ value }) => {
    this.setState({
      value
    });
  };

  render() {
    const { label, name } = this.props;
    return (
      <InlineField>
        <Label id={name}>{label}</Label>
        <ToggleSwitch
          id={name}
          onChange={this.handleChange}
          checked={this.state.value}
          {...this.props}
        />
      </InlineField>
    );
  }
}

storiesOf("ToggleSwitch", module)
  .add("Default", () => (
    <StoryContainer>
      <Wrapper>
        <StatefulToggleSwitch label="Hello world" name="demo" />
      </Wrapper>
    </StoryContainer>
  ))
  .add("Multiple", () => (
    <StoryContainer>
      <Wrapper>
        <StatefulToggleSwitch label="Navigation" name="navigation" />
        <StatefulToggleSwitch label="Introduction" name="introduction" />
        <StatefulToggleSwitch label="Summary" name="summary" />
        <StatefulToggleSwitch label="Confirmation" name="confirmation" />
        <StatefulToggleSwitch label="Mandatory" name="mandatory" />
      </Wrapper>
    </StoryContainer>
  ));
