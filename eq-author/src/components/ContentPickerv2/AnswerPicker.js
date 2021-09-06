import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";

import { colors } from "constants/theme";

import { ErrorMessage } from "./ErrorMessage";
import SectionMenu from "./SectionMenu";
import Options, { OPTION_ANSWERS, OPTION_SECTIONS } from "./Options";
import { FlatSectionMenu } from "./Menu";
import ScrollPane from "components/ScrollPane";
import SearchBar from "components/SearchBar";

import searchByAnswerTitleOrShortCode from "../../utils/searchFunctions/searchByAnswerTitleShortCode";
import searchByQuestionTitleOrShortCode from "../../utils/searchFunctions/searchByQuestionTitleShortCode";
import { getPageById } from "utils/questionnaireUtils";

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
      const results = filterResultsByPageDetails(
        data,
        searchTerm.toLocaleLowerCase()
      );

      setSearchResults(results);
    } else {
      setSearchResults(data);
    }
  }, [searchTerm, data]);

  const filterResultsByPageDetails = (data, searchTerm) => {
    let questionSearchResults = searchByQuestionTitleOrShortCode(
      data,
      searchTerm
    );

    let answerSearchResults = searchByAnswerTitleOrShortCode(data, searchTerm);

    answerSearchResults.map((section) => {
      const { folders, ...rest } = section;

      const foldersNew = folders.map((folder) => {
        const { pages, ...rest } = folder;

        const pagesNew = pages.map((page) => {
          const { id } = page;

          const pageFromPageResults = getPageById(
            { sections: questionSearchResults },
            id
          );

          if (pageFromPageResults) {
            return pageFromPageResults;
          }

          return page;
        });

        return { pages: pagesNew, ...rest };
      });

      return { folders: foldersNew, ...rest };
    });

    console.log(answerSearchResults);
    return data;
  };

  return (
    <>
      <ModalHeader>
        <ModalTitle>Select an answer</ModalTitle>
        <ModalToolbar>
          <SearchBar onChange={({ value }) => setSearchTerm(value)} />
          <Options
            onChange={(e) => setOption(e.target.value)}
            option={option}
          />
        </ModalToolbar>
      </ModalHeader>
      <MenuContainer>
        {option === OPTION_ANSWERS && (
          <ScrollPane>
            {searchResults.length > 0 && (
              <FlatSectionMenu data={searchResults} {...otherProps} />
            )}
          </ScrollPane>
        )}
        {option === OPTION_SECTIONS && searchResults.length > 0 && (
          <SectionMenu data={searchResults} {...otherProps} />
        )}
        {searchResults.length === 0 && ErrorMessage("answers")}
      </MenuContainer>
    </>
  );
};

AnswerPicker.propTypes = {
  data: PropTypes.arrayOf(CustomPropTypes.section),
};

export default AnswerPicker;
