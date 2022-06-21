import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { useQuery } from "@apollo/react-hooks";

import styled from "styled-components";

import { colors } from "constants/theme";
import {
  SubMenuItem,
  MenuItemType,
  MenuItemTitle,
  MenuItemSubtitle,
} from "./Menu";
import Truncated from "components/Truncated";

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

const RightPositioner = styled.div`
  float: right;
`;

const TableHeader = styled.div`
  display: table-header-group;
  background: ${colors.lighterGrey};
  font-size: 11px;
  padding: 0.3rem 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: bold;
  color: ${colors.darkGrey};
  line-height: 1.1;
`;

const Col = styled.div`
  display: table-cell;
  padding: 0 1rem;
  vertical-align: middle;
  margin: auto;
  border-bottom: 1px solid ${colors.lightGrey};
`;

const TableHeadCol = styled.div`
  display: table-cell;
  padding: 1em 3em 1em 1.5em;
`;

const VariableItem = styled(SubMenuItem)`
  display: table-row;
`;

const VariableItemList = styled.ul`
  display: table-row-group;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const VariablePicker = ({ onSelected, isSelected, pageType, data }) => {
  const onEnterUp = (event, item) => {
    if (event.keyCode === 13) {
      //13 is the enter keycode
      onSelected(item);
    }
  };

  const totalObject = (data) => {
    let tempTotalObject;
    if (!data) {
      tempTotalObject = {
        id: "total",
        displayName: "total",
      };
    } else {
      tempTotalObject = {
        id: data.id,
        displayName: formatTotalTitle(data.totalTitle),
        type: data.type,
      };
    }

    return tempTotalObject;
  };

  // removes paragraph tags from total title if a title exists.
  const formatTotalTitle = (title) => {
    if (!title) {
      return "Untitled total";
    }
    return title.slice(3, -4);
  };

  return (
    <>
      <ModalHeader>
        <ModalTitle>Select a variable</ModalTitle>
      </ModalHeader>
      <MenuContainer>
        <ScrollPane>
          <Table>
            <TableHeader>
              <TableHeadCol>Name</TableHeadCol>
              <TableHeadCol>
                <RightPositioner>Type</RightPositioner>
              </TableHeadCol>
            </TableHeader>
            <VariableItemList>
              {pageType === "QuestionPage" ? (
                data.map((calculatedSummaryPage) => {
                  return (
                    <VariableItem
                      id={calculatedSummaryPage.id}
                      key={calculatedSummaryPage.id}
                      onClick={() =>
                        onSelected(totalObject(calculatedSummaryPage))
                      }
                      aria-selected={isSelected(
                        totalObject(calculatedSummaryPage)
                      )}
                      aria-label={"total"}
                      tabIndex="0"
                      onKeyUp={(event) =>
                        onEnterUp(event, totalObject(calculatedSummaryPage))
                      }
                    >
                      <Col>
                        <MenuItemTitle>
                          <Truncated>
                            {formatTotalTitle(calculatedSummaryPage.totalTitle)}
                          </Truncated>
                        </MenuItemTitle>
                        <MenuItemSubtitle>
                          <Truncated>Calculated summary</Truncated>
                        </MenuItemSubtitle>
                      </Col>
                      <Col>
                        <RightPositioner>
                          <MenuItemType>
                            {calculatedSummaryPage.type}
                          </MenuItemType>
                        </RightPositioner>
                      </Col>
                    </VariableItem>
                  );
                })
              ) : (
                <VariableItem
                  key="total"
                  onClick={() => onSelected(totalObject())}
                  aria-selected={isSelected(totalObject())}
                  aria-label={"total"}
                  tabIndex="0"
                  onKeyUp={(event) => onEnterUp(event, totalObject())}
                >
                  <Col>
                    <MenuItemTitle>
                      <Truncated>Total</Truncated>
                    </MenuItemTitle>
                    <MenuItemSubtitle>
                      <Truncated>Calculated summary</Truncated>
                    </MenuItemSubtitle>
                  </Col>
                  <Col>
                    <RightPositioner>
                      <MenuItemType>Number</MenuItemType>
                    </RightPositioner>
                  </Col>
                </VariableItem>
              )}
            </VariableItemList>
          </Table>
        </ScrollPane>
      </MenuContainer>
    </>
  );
};

VariablePicker.propTypes = {
  data: PropTypes.arrayOf(CustomPropTypes.metadata),
  onSelected: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
};

export default VariablePicker;
