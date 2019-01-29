import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { clamp, isNaN } from "lodash";

import Input from "components/Forms/Input";
import { NUMBER, PERCENTAGE, CURRENCY } from "constants/answer-types";
import { radius } from "constants/theme";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: center;
  width: 8em;
`;

const StyledInput = styled(Input)`
  width: 100%;

  border-radius: ${radius};
  outline: none;

  &[type="number"]::-webkit-inner-spin-button,
  &[type="number"]::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }

  &[type="number"] {
    appearance: textfield;
  }

  ${props => props.valueType === CURRENCY && "padding-left: 1.4em"}
  ${props => props.valueType === PERCENTAGE && "padding-right: 1.6em"}
`;

const UnitSymbol = styled.div`
  position: absolute;
  opacity: 0.5;
  ${props => (props.trailing ? "right: 0.5em" : "left: 0.5em")}
`;

class Number extends React.Component {
  state = {
    value: this.props.value,
  };

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      /*eslint-disable-next-line  */
      this.setState({
        value: this.props.value,
      });
    }
  }

  handleChange = ({ value }) => {
    this.setState({ value });
  };

  handleBlur = () => {
    const name = this.props.name || this.props.id;
    const { value } = this.state;
    const enteredValue = clamp(
      parseInt(value, 10),
      this.props.min,
      this.props.max
    );

    const newValue =
      isNaN(enteredValue) || Object.is(enteredValue, -0)
        ? this.props.default
        : enteredValue;

    this.setState({ value: newValue });

    this.props.onChange({
      name,
      value: newValue,
    });
    if (this.props.onBlur) {
      setImmediate(() => {
        this.props.onBlur();
      });
    }
  };

  render() {
    const unitId = `unit-${this.props.id}`;
    return (
      <StyledDiv className={this.props.className}>
        <StyledInput
          id={this.props.id}
          data-test={this.props["data-test"]}
          value={this.state.value}
          onChange={this.handleChange}
          type="number"
          onBlur={this.handleBlur}
          aria-live="assertive"
          role="alert"
          valueType={this.props.type}
          aria-labelledby={unitId}
          min={this.props.min}
          max={this.props.max}
          default={this.props.default}
          name={this.props.name}
          step={this.props.step}
        />
        {this.props.type === CURRENCY && (
          <UnitSymbol id={unitId} data-test="unit">
            £
          </UnitSymbol>
        )}
        {this.props.type === PERCENTAGE && (
          <UnitSymbol id={unitId} data-test="unit" trailing>
            %
          </UnitSymbol>
        )}
      </StyledDiv>
    );
  }
}

Number.defaultProps = {
  min: 0,
  step: 1,
  default: 0,
  "data-test": "number-input",
};

Number.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  value: PropTypes.number,
  step: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number.isRequired,
  default: PropTypes.number,
  type: PropTypes.oneOf([CURRENCY, PERCENTAGE, NUMBER]),
  "data-test": PropTypes.string,
  className: PropTypes.string,
};

export default Number;
