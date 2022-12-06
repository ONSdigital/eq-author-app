import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";

import { colors } from "constants/theme";

import { ErrorMessage } from "./ErrorMessage";
import NoSearchResults from "components/NoSearchResults";
import SectionMenu from "./SectionMenu";
import Options, { OPTION_ANSWERS, OPTION_SECTIONS } from "./Options";
import { FlatSectionMenu } from "./Menu";
import ScrollPane from "components/ScrollPane";
import SearchBar from "components/SearchBar";
import { Field, Label } from "components/Forms";
import Input from "components-themed/Input";

import searchByAnswerTitleQuestionTitleShortCode from "utils/searchFunctions/searchByAnswerTitleQuestionTitleShortCode";
import { getPages } from "utils/questionnaireUtils";

const ModalTitle = styled.h2`
  font-weight: bold;
  font-size: 1.2em;
  color: ${colors.textLight};
  margin-top: 0;
`;

const ModalHeader = styled.div`
  padding: 4em 1em 1em;
  border-bottom: 1px solid ${colors.bordersLight};
`;

const ModalToolbar = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MenuContainer = styled.div`
  overflow: hidden;
  height: 25em;
`;

const StyledRadioInput = styled(Input)`
  position: relative;
  margin-right: 0.5em;
`;

const StyledLabel = styled(Label)`
  margin-top: 0.3em;
  margin-right: 2em;
`;

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => (props.open ? "0.4em" : "2em")};
  > * {
    margin-bottom: 0;
  }
`;

const AnswerPicker = ({ data, ...otherProps }) => {
  const [option, setOption] = useState(
    data.length > 1 ? OPTION_SECTIONS : OPTION_ANSWERS
  );

  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (data) {
      setSearchResults(data);
    }
  }, [data]);

  useEffect(() => {
    if (searchTerm && searchTerm !== "" && searchTerm !== " ") {
      const results = searchByAnswerTitleQuestionTitleShortCode(
        data,
        searchTerm
      );

      setSearchResults(results);
    } else {
      setSearchResults(data);
    }
  }, [searchTerm, data]);

  const numOfResults = getPages({ sections: searchResults }).length;

  return (
    <>
      <ModalHeader>
        <ModalTitle>Select an answer</ModalTitle>
        <InlineField>
          <StyledRadioInput type="radio" />
          <StyledLabel bold={false}>Answer</StyledLabel>
          <StyledRadioInput type="radio" />
          <StyledLabel bold={false}>Metadata</StyledLabel>
        </InlineField>
        <ModalToolbar>
          <SearchBar onChange={({ value }) => setSearchTerm(value)} />
          <Options
            onChange={(e) => setOption(e.target.value)}
            option={option}
          />
        </ModalToolbar>
      </ModalHeader>
      <MenuContainer>
        {option === OPTION_ANSWERS && data.length > 0 && numOfResults > 0 && (
          <ScrollPane>
            <FlatSectionMenu data={searchResults} {...otherProps} />
          </ScrollPane>
        )}
        {option === OPTION_SECTIONS && data.length > 0 && numOfResults > 0 && (
          <SectionMenu data={searchResults} {...otherProps} />
        )}
        {data.length > 0 && numOfResults === 0 && (
          <NoSearchResults
            searchTerm={searchTerm}
            alertText="Please check the answer exists."
          />
        )}
        {data.length === 0 && ErrorMessage("answers")}
      </MenuContainer>
    </>
  );
};

AnswerPicker.propTypes = {
  data: PropTypes.arrayOf(CustomPropTypes.section),
};

export default AnswerPicker;
