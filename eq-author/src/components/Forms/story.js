/* eslint-disable react/prop-types */
import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import styled from "styled-components";
import {
  Field,
  Input,
  Label,
  Select,
  TextArea,
  Number
} from "components/Forms";

const Width = styled.div`
  max-width: 30em;
  padding: 2em;
`;

class NumberWrapper extends React.Component {
  constructor(props) {
    super();
    this.state = {
      "number.input": props.min
    };
  }

  handleChange = ({ value }) => {
    this.setState({
      "number.input": value
    });
  };

  render = () => (
    <Field id="number.input">
      <Label>Name</Label>
      <Number
        {...this.props}
        onChange={this.handleChange}
        value={this.state["number.input"]}
      />
    </Field>
  );
}

storiesOf("Forms", module)
  .addDecorator(story => <Width>{story()}</Width>)
  .add("Input/Text", () => (
    <Field>
      <Label htmlFor="name">Name</Label>
      <Input id="name" type="text" />
    </Field>
  ))
  .add("Input/Number", () => <NumberWrapper min={0} max={100} />)
  .add("Input/Number Min=1 Max=100", () => <NumberWrapper min={1} max={100} />)
  .add("Input/Checkbox", () => (
    <Field>
      <Input id="navigation" type="checkbox" />
      <Label htmlFor="navigation" inline>
        Navigation
      </Label>
    </Field>
  ))
  .add("Select", () => (
    <Field>
      <Label htmlFor="options">Options</Label>
      <Select value="UKIS" onChange={action("change")} id="options">
        <option value="Default">Default</option>
        <option value="UKIS">UKIS</option>
        <option value="Census">Census</option>
      </Select>
    </Field>
  ))
  .add("TextArea", () => (
    <Field>
      <Label id="description">Description</Label>
      <TextArea id="description" />
    </Field>
  ));
