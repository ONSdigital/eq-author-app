import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Input } from "components/Forms";
import VisuallyHidden from "components/VisuallyHidden";
import { colors } from "constants/theme";

import iconSearch from "./icon-search.svg";

const Search = styled.div`
  position: relative;
  margin-left: ${(props) => (props.paddingType === "small" ? "1em" : "0")};
  margin-right: 1em;
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
  width: ${(props) => (props.size === "large" ? "27em" : "20em")};
  padding: ${(props) => (props.paddingType === "large" ? "0.6em" : "0.4em")};
  line-height: 1;
  padding-left: 2.5em;
  border-radius: 4px;
  border-color: ${colors.bordersLight};

  &:hover {
    outline: none;
  }
`;

const SearchBar = ({ onChange, size, paddingType }) => {
  return (
    <>
      <Search paddingType={paddingType}>
        <VisuallyHidden>
          <label htmlFor="search">Search</label>
        </VisuallyHidden>
        <SearchInput
          id="search"
          defaultValue={""}
          onChange={onChange}
          paddingType={paddingType}
          size={size}
          data-test="search-bar"
        />
      </Search>
    </>
  );
};

SearchBar.propTypes = {
  onChange: PropTypes.func,
  size: PropTypes.string,
  paddingType: PropTypes.string,
};

export default SearchBar;
