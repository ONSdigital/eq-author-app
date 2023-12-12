import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import styled from "styled-components";

import { colors } from "constants/theme";
import { SubMenuItem, MenuItemType, MenuItemTitle } from "./Menu";
import Truncated from "components/Truncated";

import ScrollPane from "components/ScrollPane";

import ContentTypeSelector from "./ContentTypeSelector";

const ModalTitle = styled.div`
  font-weight: bold;
  font-size: 1.2em;
  color: ${colors.textLight};
  margin-bottom: 0.5em;
`;

const ModalHeader = styled.div`
  padding: 2em 1em;
  border-bottom: 1px solid ${colors.bordersLight};
`;

const MenuContainer = styled.div`
  overflow: hidden;
  height: 26.3em;
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
  height: 3.5em;
`;

const VariableItemList = styled.ul`
  display: table-row-group;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const ListAnswerPicker = ({
  onSelected,
  isSelected,
  data,
  contentType,
  contentTypes,
  setContentType,
}) => {
  const onEnterUp = (event, item) => {
    if (event.keyCode === 13) {
      //13 is the enter keycode
      onSelected(item);
    }
  };

  return (
    <>
      <ModalHeader>
        <ModalTitle>Select an answer</ModalTitle>
        {contentTypes.length > 1 && (
          <ContentTypeSelector
            contentType={contentType}
            contentTypes={contentTypes}
            setContentType={(contentType) => setContentType(contentType)}
          />
        )}
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
              {data.map((answer) => {
                return (
                  <VariableItem
                    id={answer.id}
                    key={answer.id}
                    onClick={() => onSelected(answer)}
                    aria-selected={isSelected(answer)}
                    aria-label={answer}
                    tabIndex="0"
                    onKeyUp={(event) => onEnterUp(event, answer)}
                  >
                    <Col>
                      <MenuItemTitle>
                        <Truncated>{answer.displayName}</Truncated>
                      </MenuItemTitle>
                    </Col>
                    <Col>
                      <RightPositioner>
                        <MenuItemType>{answer.type}</MenuItemType>
                      </RightPositioner>
                    </Col>
                  </VariableItem>
                );
              })}
            </VariableItemList>
          </Table>
        </ScrollPane>
      </MenuContainer>
    </>
  );
};

ListAnswerPicker.defaultProps = {
  contentPickerTitle: "Select an answer",
};

ListAnswerPicker.propTypes = {
  data: PropTypes.arrayOf(CustomPropTypes.answer),
  onSelected: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
  pageType: PropTypes.string,
  contentType: PropTypes.string,
  contentTypes: PropTypes.arrayOf(PropTypes.string),
  setContentType: PropTypes.func,
  contentPickerTitle: PropTypes.string,
};

export default ListAnswerPicker;
