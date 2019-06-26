import React from "react";
import reactStringReplace from "react-string-replace";
import PropTypes from "prop-types";
import styled from "styled-components";
import Downshift from "downshift";
import gql from "graphql-tag";

import { colors } from "constants/theme";

import { Field, Label } from "components/Forms";

import { UncontrolledInput } from "components/Forms/Input";

const maxListHeight = 6;

const Container = styled.div`
  margin: 0 0 2em;
  background: #ebeef0;
  padding: 1em 1em 0;
  height: 100%;
`;

const SearchInput = styled(UncontrolledInput)`
  padding: 0.5em;
  font-size: 1em;
  width: 100%;
  border: 1px solid ${colors.borders};
`;

const SearchResults = styled.ul`
  list-style: none;
  margin: -1px 0 0;
  padding: 0;
  border: 1px solid ${colors.bordersLight};
  max-height: ${maxListHeight}em;
  overflow: scroll;
  position: absolute;
  width: 100%;
  z-index: 2;
  background: white;

  &:empty {
    display: none;
  }
`;

const SearchResult = styled.li`
  display: flex;
  align-items: center;
  font-size: 0.85em;
  padding: 0.3em;
  height: 2em;
  cursor: pointer;
  background-color: ${props =>
    props.selected ? colors.lighterGrey : "transparent"};

  &:not(:last-of-type) {
    border-bottom: 1px solid ${colors.bordersLight};
  }
`;

const SearchResultName = styled.span`
  font-weight: bold;
  margin-right: 0.5em;
`;

const SearchResultEmail = styled.span`
  font-weight: normal;
`;

const Highlight = styled.span`
  text-decoration: underline;
`;

const highlighSearchTerm = (...args) =>
  reactStringReplace(...args, (match, i) => (
    <Highlight key={i}>{match}</Highlight>
  ));

const UserSearch = ({ users, onUserSelect }) => {
  return (
    <Container>
      <Downshift
        initialIsOpen={false}
        onSelect={onUserSelect}
        itemToString={() => ""}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          isOpen,
          inputValue,
          highlightedIndex,
        }) => (
          <div>
            <Field>
              <Label {...getLabelProps()}>Add editors</Label>
              <SearchInput
                {...getInputProps()}
                placeholder="search people by name or email address"
              />
              <SearchResults {...getMenuProps()}>
                {isOpen &&
                  users
                    .filter(user => {
                      if (!inputValue) {
                        return false;
                      }
                      const value = inputValue.toLowerCase();
                      return (
                        user.name.toLowerCase().includes(value) ||
                        user.email.toLowerCase().includes(value)
                      );
                    })
                    .map((user, index) => (
                      <SearchResult
                        key={user.id}
                        {...getItemProps({
                          index,
                          item: user,
                          selected: highlightedIndex === index,
                        })}
                      >
                        <SearchResultName>
                          {highlighSearchTerm(user.name, inputValue)}
                        </SearchResultName>
                        <SearchResultEmail>
                          {"<"}
                          {highlighSearchTerm(user.email, inputValue)}
                          {">"}
                        </SearchResultEmail>
                      </SearchResult>
                    ))}
              </SearchResults>
            </Field>
          </div>
        )}
      </Downshift>
    </Container>
  );
};

UserSearch.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    })
  ).isRequired,
  onUserSelect: PropTypes.func.isRequired,
};

UserSearch.fragment = gql`
  fragment UserSearch on User {
    id
    name
    email
  }
`;

export default UserSearch;
