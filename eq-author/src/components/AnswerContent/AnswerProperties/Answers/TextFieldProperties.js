import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import Required from "components/AdditionalContent/Required";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const TextFieldProperties = ({ answer, updateAnswer }) => {
  return (
    <>
      <Container>
        <Required answer={answer} updateAnswer={updateAnswer} />
      </Container>
    </>
  );
};

TextFieldProperties.propTypes = {
  updateAnswer: PropTypes.func,
  answer: PropTypes.object, //eslint-disable-line
};

export default TextFieldProperties;
