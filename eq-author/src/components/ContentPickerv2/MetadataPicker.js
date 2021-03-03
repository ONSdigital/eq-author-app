import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import styled from "styled-components";

import { colors } from "constants/theme";

import { ErrorMessage } from "./ErrorMessage";
import { SubMenuItem, MenuItemType } from "./Menu";

import ScrollPane from "components/ScrollPane";

const ModalTitle = styled.div`
  font-weight: bold;
  font-size: 1.2em;
  color: ${colors.textLight};
`;

const ModalHeader = styled.div`
  padding: 2em 1em;
  border-bottom: 1px solid ${colors.bordersLight};
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

const MetaDataItem = styled(SubMenuItem)`
  display: table-row;
  height: 2em;
`;

const MetaDataItemList = styled.ul`
  display: table-row-group;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const MetaDataPicker = ({ data, isSelected, onSelected }) => {
  const onEnterUp = (event, item) => {
    if (event.keyCode === 13) {
      //13 is the enter keycode
      onSelected(item);
    }
  };
  return (
    <>
      <ModalHeader>
        <ModalTitle>Select metadata</ModalTitle>
      </ModalHeader>
      <MenuContainer>
        <ScrollPane>
          {data.length ? (
            <Table>
              <TableHeader>
                <TableHeadCol>Key</TableHeadCol>
                <TableHeadCol>Alias</TableHeadCol>
                <TableHeadCol>Type</TableHeadCol>
                <TableHeadCol>Value</TableHeadCol>
              </TableHeader>

              <MetaDataItemList>
                {data.map((metadata) => {
                  return (
                    <MetaDataItem
                      key={metadata.id}
                      onClick={() => onSelected(metadata)}
                      aria-selected={isSelected(metadata)}
                      aria-label={metadata.key}
                      tabIndex="0"
                      onKeyUp={(event) => onEnterUp(event, metadata)}
                    >
                      <Col>{metadata.key}</Col>
                      <Col>{metadata.displayName}</Col>
                      <Col>
                        <MenuItemType>{metadata.type}</MenuItemType>
                      </Col>
                      <Col>
                        {metadata[`${metadata.type.toLowerCase()}Value`]}
                      </Col>
                    </MetaDataItem>
                  );
                })}
              </MetaDataItemList>
            </Table>
          ) : (
            ErrorMessage("metadata")
          )}
        </ScrollPane>
      </MenuContainer>
    </>
  );
};

MetaDataPicker.propTypes = {
  data: PropTypes.arrayOf(CustomPropTypes.metadata),
  onSelected: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
};

export default MetaDataPicker;
