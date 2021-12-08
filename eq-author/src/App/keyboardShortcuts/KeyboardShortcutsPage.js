import React from "react";
import Header from "components/EditorLayout/Header";

import styled from "styled-components";

import { colors } from "constants/theme";

import {
  Layout,
  SharePageTitle,
  Description,
} from "../sharing/styles/SharePageContent";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledLayout = styled.div`
  width: 100%;
  height: 100%;
`;

const TableOuter = styled.table`
  width: 100%;
  border: 1px solid ${colors.grey35};
  padding: 0;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${colors.grey35};
`;

const TableHeader = styled.td`
  width: 50%;
  padding: 1em;
  text-align: left;
  font-size: 1.25em;
`;

const TableDataLightGrey = styled.td`
  padding: 1em;
  text-align: left;
  font-size: 1.25em;
`;

const TableDataDarkGrey = styled.td`
  padding: 1em;
  text-align: left;
  font-size: 1.25em;
  border-top: 1px solid ${colors.grey35};
  border-bottom: 1px solid ${colors.grey35};
  background-color: ${colors.grey5};
`;

const KeyboardShortcutsPage = () => {
  return (
    <Container>
      <Header title="Shortcuts" tabIndex="-1" className="keyNav" />

      <Layout title="Shortcuts" tabIndex="-1" className="keyNav">
        <StyledLayout>
          <SharePageTitle>Keyboard shortcuts</SharePageTitle>
          <Description>
            Keyboard shortcuts allow you to quickly navigate through the main
            page areas on display.
          </Description>
          <TableOuter>
            <TableRow>
              <TableHeader>Action</TableHeader>
              <TableHeader>Shortcut</TableHeader>
            </TableRow>
            <TableRow>
              <TableDataDarkGrey>
                Shift the focus to the next page area
              </TableDataDarkGrey>
              <TableDataDarkGrey>
                <strong>F6</strong>
              </TableDataDarkGrey>
            </TableRow>
            <TableRow>
              <TableDataLightGrey>
                Shift the focus to the previous visible page area
              </TableDataLightGrey>
              <TableDataLightGrey>
                <strong>Shift + F6</strong>
              </TableDataLightGrey>
            </TableRow>
          </TableOuter>
        </StyledLayout>
      </Layout>
    </Container>
  );
};

export default KeyboardShortcutsPage;
