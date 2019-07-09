import React from "react";

import Link from "components/Link";
import icon from "./icon-denied.svg";
import styled from "styled-components";

import Layout from "components/Layout";

const CenteredPane = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 6em;
`;

const Icon = styled.div`
  background: url(${icon}) no-repeat center center;
  background-size: contain;
  width: 100px;
  height: 100px;
  margin-bottom: 1em;
`;

const Title = styled.h1`
  font-size: 1em;
  font-weight: 600;
  margin: 0;
`;

const AccessDenied = () => (
  <Layout title={"Access denied"}>
    <CenteredPane>
      <Icon />
      <Title data-test="access-denied-page-title">403 — Access Denied</Title>
      <p>Sorry, you do not have access to this questionnaire.</p>
      <Link href="/">Back to home</Link>
    </CenteredPane>
  </Layout>
);

export default AccessDenied;
