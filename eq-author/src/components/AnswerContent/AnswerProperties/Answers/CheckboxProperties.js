import React from "react";
import PropTypes from "prop-types";
import Required from "components/AdditionalContent/Required";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const CheckboxProperties = ({ answer, updateAnswer }) => {
  return (
    <>
      <Container>
        <Required answer={answer} updateAnswer={updateAnswer} />
      </Container>
    </>
  );
};

CheckboxProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  updateAnswer: PropTypes.func,
};

export default CheckboxProperties;
