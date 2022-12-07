import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";

import { colors } from "constants/theme";

import { ErrorMessage } from "./ErrorMessage";
import RadioToolbar from "./RadioToolbar";
import NoSearchResults from "components/NoSearchResults";
import SectionMenu from "./SectionMenu";
import Options, { OPTION_ANSWERS, OPTION_SECTIONS } from "./Options";
import { FlatSectionMenu } from "./Menu";
import ScrollPane from "components/ScrollPane";
import SearchBar from "components/SearchBar";

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

const AnswerPicker = ({
  data,
  contentView,
  setContentView,
  logic,
  ...otherProps
}) => {
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
        <ModalTitle>
          {logic ? "Select an answer or metadata" : "Select an answer"}
        </ModalTitle>
        {logic && (
          <RadioToolbar
            selectedRadio={contentView}
            setContentView={(contentView) => setContentView(contentView)}
          />
        )}
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
