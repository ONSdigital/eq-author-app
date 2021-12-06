import React from "react";
import Header from "components/EditorLayout/Header";

import styled from "styled-components";

import {
  Layout,
  SharePageTitle,
  Description,
} from "../sharing/styles/SharePageContent";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  &:focus {
    border: 3px solid #fdbd56;
    margin: 0;
    outline: none;
  }
`;

const StyledLayout = styled.div`
  width: 100%;
  height: 100%;
  &:focus {
    border: 3px solid #fdbd56;
    margin: 0;
    outline: none;
  }
`;

const TableOuter = styled.table`
  width: 100%;
  border: 1px solid #999;
  padding: 0;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #999;
`;

const TableHeader = styled.td`
  width: 50%;
  padding: 1em;
  text-align: left;
  font-size: 1.25em;
`;

const TableData = styled.td`
  padding: 1em;
  text-align: left;
  font-size: 1.25em;
`;

const TableDataB = styled.td`
  padding: 1em;
  text-align: left;
  font-size: 1.25em;
  border-top: 1px solid #999;
  border-bottom: 1px solid #999;
  background-color: #ececec;
`;

const PageSkipPage = () => {
  return (
    <Container>
      <Header title="Shortcuts" id="SuperNav-4" tabIndex="-1" />

      <Layout title="Shortcuts">
        <StyledLayout id="SuperNav-5" tabIndex="-1">
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
              <TableDataB>Shift the focus to the next page area</TableDataB>
              <TableDataB>
                <strong>F6</strong>
              </TableDataB>
            </TableRow>
            <TableRow>
              <TableData>
                Shift the focus to the previous visible page area
              </TableData>
              <TableData>
                <strong>F7</strong>
              </TableData>
            </TableRow>
          </TableOuter>
        </StyledLayout>
      </Layout>
    </Container>
  );
};

export default PageSkipPage;
