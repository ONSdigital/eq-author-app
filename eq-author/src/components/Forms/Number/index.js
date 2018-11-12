import React from "react";
import Input from "components/Forms/Input";
import styled from "styled-components";
import PropTypes from "prop-types";
import { clamp, isNaN } from "lodash";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledInput = styled(Input)`
  width: 4em;

  &[type="number"]::-webkit-inner-spin-button,
  &[type="number"]::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }

  &[type="number"] {
    appearance: textfield;
  }
`;

class Number extends React.Component {
  state = {
    value: this.props.value
  };

  onComponentDidUpdate() {
    if (this.props.value !== this.state.value) {
      this.setState({
        value: this.props.value
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      /*eslint-disable-next-line  */
      this.setState({
        value: this.props.value
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
      value: newValue
    });
    if (this.props.onBlur) {
      setImmediate(() => {
        this.props.onBlur();
      });
    }
  };

  render() {
    return (
      <StyledDiv>
        <StyledInput
          {...this.props}
          value={this.state.value}
          onChange={this.handleChange}
          type="number"
          onBlur={this.handleBlur}
          aria-live="assertive"
          role="alert"
          data-test="number-input"
        />
      </StyledDiv>
    );
  }
}

Number.defaultProps = {
  min: 0,
  step: 1,
  default: 0
};

Number.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  value: PropTypes.number,
  step: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number.isRequired
};

export default Number;
