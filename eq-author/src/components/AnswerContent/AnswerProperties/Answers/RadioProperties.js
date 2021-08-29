import React from "react";
import PropTypes from "prop-types";
import Required from "components/AnswerContent/Required";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const RadioProperties = ({ answer, updateAnswer }) => {
  return (
    <>
      <Container>
        <Required answer={answer} updateAnswer={updateAnswer} />
      </Container>
    </>
  );
};

RadioProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  updateAnswer: PropTypes.func,
};

export default RadioProperties;
