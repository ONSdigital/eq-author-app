import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";

import { colors } from "constants/theme";

import { ErrorMessage } from "./ErrorMessage";
import ContentTypeSelector from "./ContentTypeSelector";
import NoSearchResults from "components/NoSearchResults";
import SectionMenu from "./SectionMenu";
import Options, { OPTION_ANSWERS, OPTION_SECTIONS } from "./Options";
import { FlatSectionMenu } from "./Menu";
import ScrollPane from "components/ScrollPane";
import SearchBar from "components/SearchBar";

import searchByAnswerTitleQuestionTitleShortCode from "utils/searchFunctions/searchByAnswerTitleQuestionTitleShortCode";
import { getPages } from "utils/questionnaireUtils";

const ModalTitle = styled.div`
  font-weight: bold;
  font-size: 1.2em;
  color: ${colors.textLight};
  margin-bottom: 0.5em;
`;

const ModalHeader = styled.div`
  padding: 2em 1em 1em;
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
  contentType,
  contentTypes,
  setContentType,
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
          {contentTypes.length > 1
            ? "Select an answer or metadata"
            : "Select an answer"}
        </ModalTitle>
        {contentTypes.length > 1 && (
          <ContentTypeSelector
            contentType={contentType}
            contentTypes={contentTypes}
            setContentType={(contentType) => setContentType(contentType)}
          />
        )}
        <ModalToolbar>
          <SearchBar
            onChange={({ value }) => setSearchTerm(value)}
            placeholder="Search answers"
          />
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
  contentType: PropTypes.string,
  contentTypes: PropTypes.arrayOf(PropTypes.string),
  setContentType: PropTypes.func,
};

export default AnswerPicker;
