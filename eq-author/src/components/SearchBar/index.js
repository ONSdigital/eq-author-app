import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Input } from "components/Forms";
import VisuallyHidden from "components/VisuallyHidden";
import { colors } from "constants/theme";

import iconSearch from "./icon-search.svg";

const Search = styled.div`
  position: relative;
  &::before {
    content: url(${iconSearch});
    display: inline-block;
    position: absolute;
    left: 0.5em;
    top: 0;
    bottom: 0;
    height: 2em;
    margin: auto;
  }
`;

const SearchInput = styled(Input).attrs({
  type: "search",
  placeholder: "Search",
})`
  width: 20em;
  padding: 0.6em;
  line-height: 1;
  padding-left: 2.5em;
  border-radius: 4px;
  border-color: ${colors.bordersLight};

  &:hover {
    outline: none;
  }
`;

const SearchBar = ({ onChange }) => {

    return (
        <>
        <Search>
          <VisuallyHidden>
            <label htmlFor="search">Search</label>
          </VisuallyHidden>
          <SearchInput
            id="search"
            defaultValue={""}
            onChange={onChange}
          />
        </Search>
        </>
    );
};

SearchBar.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export default SearchBar;