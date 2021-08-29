import React from "react";
import PropTypes from "prop-types";
import Required from "components/AnswerContent/Required";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const DateRangeProperties = ({ answer, updateAnswer }) => {
  return (
    <>
      <Container>
        <Required answer={answer} updateAnswer={updateAnswer} />
      </Container>
    </>
  );
};

DateRangeProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  updateAnswer: PropTypes.func,
};

export default DateRangeProperties;
