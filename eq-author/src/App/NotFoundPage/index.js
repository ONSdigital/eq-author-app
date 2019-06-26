import React from "react";
import styled from "styled-components";

import Link from "components/Link";
import Layout from "components/Layout";

import brokenPencil from "./broken-pencil.min.svg";

const CenteredPane = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 6em;
`;

const Pencil = styled.div`
  background: url(${brokenPencil}) no-repeat top left;
  background-size: contain;
  width: 397px;
  height: 135px;
`;

const Title = styled.h1`
  font-size: 1em;
  font-weight: 600;
`;

const NotFound = () => {
  return (
    <Layout title="Page not found">
      <CenteredPane>
        <Pencil />
        <Title data-test="not-found-page-title">
          404 – Sorry, the page you were looking for was not found.
        </Title>
        <Link href="/">Back to home</Link>
      </CenteredPane>
    </Layout>
  );
};

export default NotFound;
