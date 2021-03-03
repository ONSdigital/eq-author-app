import React, { useState } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";

import { colors } from "constants/theme";

import { ErrorMessage } from "./ErrorMessage";
import SectionMenu from "./SectionMenu";
import Options, { OPTION_ANSWERS, OPTION_SECTIONS } from "./Options";
import { FlatSectionMenu } from "./Menu";
import ScrollPane from "components/ScrollPane";

const ModalTitle = styled.div`
  font-weight: bold;
  font-size: 1.2em;
  color: ${colors.textLight};
`;

const ModalHeader = styled.div`
  padding: 4em 1em 1em;
  border-bottom: 1px solid ${colors.bordersLight};
  display: flex;
  align-items: center;
`;

const ModalToolbar = styled.div`
  margin-left: auto;
`;

const MenuContainer = styled.div`
  overflow: hidden;
  height: 25em;
`;

const AnswerPicker = ({ data, ...otherProps }) => {
  const [option, setOption] = useState(
    data.length > 1 ? OPTION_SECTIONS : OPTION_ANSWERS
  );

  const contents = (
    <MenuContainer>
      {option === OPTION_ANSWERS ? (
        <ScrollPane>
          {data.length ? (
            <FlatSectionMenu data={data} {...otherProps} />
          ) : (
            ErrorMessage("answers")
          )}
        </ScrollPane>
      ) : data.length ? (
        <SectionMenu data={data} {...otherProps} />
      ) : (
        ErrorMessage("answers")
      )}
    </MenuContainer>
  );
  return (
    <>
      <ModalHeader>
        <ModalTitle>Select an answer</ModalTitle>
        <ModalToolbar>
          <Options
            onChange={(e) => setOption(e.target.value)}
            option={option}
          />
        </ModalToolbar>
      </ModalHeader>
      {contents}
    </>
  );
};

AnswerPicker.propTypes = {
  data: PropTypes.arrayOf(CustomPropTypes.section),
};

export default AnswerPicker;
