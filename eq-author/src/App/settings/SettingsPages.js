import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

import GeneralSettingsPage from "./GeneralSettingsPage";
import ThemesPage from "./ThemesPage";

const Pill = ({ children, testId }) => {
  const Container = styled.div`
    width: 4em;
    padding: 0.5em 1em;
    box-sizing: content-box;
    background-color: ${colors.lightMediumGrey};
    text-align: center;

    p {
      margin: 0;
      font-weight: bold;
    }
  `;
  return (
    <Container>
      <p data-test={testId}>{children}</p>
    </Container>
  );
};

Pill.propTypes = {
  children: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
};

const SettingsPages = ({ questionnaire }) => {
  const General = <GeneralSettingsPage questionnaire={questionnaire} />;

  const Theme = <ThemesPage />;

  const pages = [General, Theme];
  return pages;
};

SettingsPages.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  questionnaire: PropTypes.object.isRequired,
};

export default SettingsPages;
