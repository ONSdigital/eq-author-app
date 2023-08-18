import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import styled from "styled-components";

import { colors } from "constants/theme";

import { ErrorMessage } from "./ErrorMessage";
import { SubMenuItem, MenuItemType } from "./Menu";
import ContentTypeSelector from "./ContentTypeSelector";

import ScrollPane from "components/ScrollPane";
import SearchBar from "components/SearchBar";
import searchMetadata from "utils/searchFunctions/searchMetadata";

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

const Table = styled.div`
  display: table;
  width: 100%;
`;

const TableHeader = styled.div`
  display: table-header-group;
  background: #f4f5f6;
  font-size: 11px;
  padding: 0.3rem 1rem;
  letter-spacing: 0.05em;
  font-weight: bold;
  color: #666;
  line-height: 1.1;
`;

const Col = styled.div`
  display: table-cell;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #d8d8d8;
`;

const TableHeadCol = styled.div`
  display: table-cell;
  padding: 0.5rem 1rem;
`;

const SupplementaryDataItem = styled(SubMenuItem)`
  display: table-row;
  height: 2em;
`;

const SupplementaryDataItemList = styled.ul`
  display: table-row-group;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const SupplementaryDataPicker = ({
  data,
  isSelected,
  onSelected,
  contentType,
  contentTypes,
  setContentType,
  contentPickerTitle,
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const onEnterUp = (event, item) => {
    if (event.keyCode === 13) {
      //13 is the enter keycode
      onSelected(item);
    }
  };

  useEffect(() => {
    if (data) {
      setSearchResults(data);
    }
  }, [data]);

  useEffect(() => {
    if (searchTerm && searchTerm !== "" && searchTerm !== " ") {
      const results = searchMetadata(data, searchTerm);

      setSearchResults(results);
    } else {
      setSearchResults(data);
    }
  }, [searchTerm, data]);

  return (
    <>
      <ModalHeader>
        <ModalTitle>{contentPickerTitle}</ModalTitle>
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
            placeholder="Search supplementary data"
          />
        </ModalToolbar>
      </ModalHeader>
      <MenuContainer>
        <ScrollPane>
          {searchResults.length ? (
            <Table>
              <TableHeader>
                <TableHeadCol>Field</TableHeadCol>
                <TableHeadCol>List</TableHeadCol>
                <TableHeadCol>Type</TableHeadCol>
              </TableHeader>

              <SupplementaryDataItemList>
                {searchResults.map((field) => {
                  return (
                    <SupplementaryDataItem
                      key={field.id}
                      onClick={() => onSelected(field)}
                      aria-selected={isSelected(field)}
                      aria-label={field.identifier}
                      tabIndex="0"
                      onKeyUp={(event) => onEnterUp(event, field)}
                    >
                      <Col>{field.displayName}</Col>
                      <Col>{field.listName}</Col>
                      <Col>
                        <MenuItemType>{field.type}</MenuItemType>
                      </Col>
                    </SupplementaryDataItem>
                  );
                })}
              </SupplementaryDataItemList>
            </Table>
          ) : (
            ErrorMessage("metadata")
          )}
        </ScrollPane>
      </MenuContainer>
    </>
  );
};

SupplementaryDataPicker.defaultProps = {
  contentPickerTitle: "Select datafield",
};

SupplementaryDataPicker.propTypes = {
  data: PropTypes.arrayOf(CustomPropTypes.metadata),
  onSelected: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
  contentType: PropTypes.string,
  contentTypes: PropTypes.arrayOf(PropTypes.string),
  setContentType: PropTypes.func,
  contentPickerTitle: PropTypes.string,
};

export default SupplementaryDataPicker;
