import React from "react";
import PropTypes from "prop-types";

import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { noop } from "lodash";

import { Label, Field } from "components/Forms";
import ToggleSwitch from "components/ToggleSwitch";
import { colors } from "constants/theme";

const Padding = styled.div`
  padding: 0.5em 0 1em;
`;

const InlineField = styled(Field)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
`;

const PropertyLabel = styled(Label)`
  font-weight: normal;
`;

const Button = styled.button`
  color: ${colors.primary};
  margin: 0.2em 0 0 -0.2em;
  position: relative;
  padding: 0.2em;
  font-size: 1em;
  font-weight: bold;
  border: none;
  text-align: left;

  &:focus {
    outline: 2px solid ${colors.tertiary};
  }
`;

const PropertyDescription = styled.p`
  display: none;
  font-weight: normal;
  margin: 0 0 0.5em;
  font-size: 0.9em;
  color: #666;
`;

const Property = ({ id, children, onChange, checked, disabled }) => (
  <InlineField>
    <PropertyLabel inline htmlFor={id}>
      {children}
    </PropertyLabel>
    <ToggleSwitch
      id={id}
      name={id}
      onChange={noop}
      checked={checked}
      disabled={disabled}
    />
  </InlineField>
);
class QuestionProperties extends React.Component {
  static propTypes = {
    page: CustomPropTypes.page.isRequired,
    onSubmit: PropTypes.func
  };

  handleChange = ({ name, value }) => {
    const { enableField, disableField, page } = this.props;
    if (value) {
      enableField(page.id, name);
    } else {
      disableField(page.id, name);
    }
  };

  render() {
    return (
      <Padding>
        <Property id="description" checked disabled>
          Question description
        </Property>

        <PropertyDescription>
          To provide added context to the question.
        </PropertyDescription>

        <Property id="definition" checked disabled>
          Question definition
        </Property>

        <PropertyDescription>
          Only to be used to define word(s) or acronym(s) within the question.
        </PropertyDescription>

        <Property id="guidance" checked disabled>
          Include/exclude
        </Property>

        <PropertyDescription>
          Only to be used to state what should be included or excluded from the
          answer.
        </PropertyDescription>

        <Property id="additionalInfo" checked disabled>
          Additional information
        </Property>

        <PropertyDescription>
          Information regarding why we are asking this question.
        </PropertyDescription>

        <Button>See how these fields are used</Button>
      </Padding>
    );
  }
}

export default QuestionProperties;
