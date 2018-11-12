import React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";
import ToggleChip from "components/ToggleChip";
import { uniqueId } from "lodash";

const Wrapper = styled.div`
  padding: 1em;
  width: 50%;
`;

class StatefulToggleChip extends React.Component {
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
    return (
      <ToggleChip
        id={uniqueId()}
        name={uniqueId()}
        onChange={this.handleChange}
        value={uniqueId()}
        checked={this.state.value}
        {...this.props}
      />
    );
  }
}

storiesOf("ToggleChip", module)
  .add("Single", () => (
    <Wrapper>
      <StatefulToggleChip title="Lorem ipsum dolor sit amet.">
        Lorem ipsum dolor sit amet.
      </StatefulToggleChip>
    </Wrapper>
  ))
  .add("Multiple", () => (
    <Wrapper>
      <StatefulToggleChip title="Lorem ipsum dolor.">
        Lorem ipsum dolor.
      </StatefulToggleChip>
      <StatefulToggleChip title="Lorem ipsum dolor sit.">
        Lorem ipsum dolor sit.
      </StatefulToggleChip>
      <StatefulToggleChip title="Lorem ipsum.">Lorem ipsum.</StatefulToggleChip>
      <StatefulToggleChip title="Lorem ipsum dolor sit amet.">
        Lorem ipsum dolor sit amet.
      </StatefulToggleChip>
      <StatefulToggleChip title="Lorem ipsum dolor sit.">
        Lorem ipsum dolor sit.
      </StatefulToggleChip>
      <StatefulToggleChip title="Lorem ipsum.">Lorem ipsum.</StatefulToggleChip>
      <StatefulToggleChip title="Lorem.">Lorem.</StatefulToggleChip>
      <StatefulToggleChip
        title="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum quos
      saepe voluptatem. Ab consectetur dolore ea eaque excepturi praesentium
      voluptate."
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum quos
        saepe voluptatem. Ab consectetur dolore ea eaque excepturi praesentium
        voluptate.
      </StatefulToggleChip>
    </Wrapper>
  ));
