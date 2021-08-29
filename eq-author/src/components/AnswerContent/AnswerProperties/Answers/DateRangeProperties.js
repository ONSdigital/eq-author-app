import React from "react";
import PropTypes from "prop-types";
import Required from "components/AdditionalContent/Required";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const DateRangeProperties = ({ answer, onUpdateRequired }) => {
  return (
    <>
      <Container>
        <Required answer={answer} onChange={onUpdateRequired} />
      </Container>
    </>
  );
};

DateRangeProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  onUpdateRequired: PropTypes.func,
};

export default DateRangeProperties;
