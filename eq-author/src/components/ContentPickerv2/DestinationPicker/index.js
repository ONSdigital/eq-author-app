import React, { useState } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";

import Options, { OPTION_ANSWERS, OPTION_SECTIONS } from "../Options";
import ScrollPane from "components/ScrollPane";

import { colors } from "constants/theme";

import SectionMenu from "./SectionMenu";
import FlatSectionMenu from "./FlatSectionMenu";
import DestinationEnd from "./DestinationEnd";

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
  height: ${props => (props.hasFooter ? "20em" : "25em")};
`;

const DestinationPicker = ({ data, ...otherProps }) => {
  const [option, setOption] = useState(
    data.length > 1 ? OPTION_SECTIONS : OPTION_ANSWERS
  );
  const isQuestionsOpen = option === OPTION_ANSWERS;

  return (
    <>
      <ModalHeader>
        <ModalTitle>Select a question</ModalTitle>
        <ModalToolbar>
          <Options
            onChange={e => setOption(e.target.value)}
            option={option}
            rightLabel={"Questions"}
          />
        </ModalToolbar>
      </ModalHeader>

      <MenuContainer hasFooter={isQuestionsOpen}>
        {isQuestionsOpen ? (
          <>
            <ScrollPane>
              <FlatSectionMenu data={data} {...otherProps} />
            </ScrollPane>
          </>
        ) : (
          <SectionMenu data={data} {...otherProps} />
        )}
      </MenuContainer>
      {isQuestionsOpen && <DestinationEnd {...otherProps} />}
    </>
  );
};

DestinationPicker.propTypes = {
  data: PropTypes.arrayOf(CustomPropTypes.section),
};

export default DestinationPicker;
