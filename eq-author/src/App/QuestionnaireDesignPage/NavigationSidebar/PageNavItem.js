import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import CustomPropTypes from "custom-prop-types";
import gql from "graphql-tag";
import { flowRight } from "lodash";

import { buildPagePath } from "utils/UrlUtils";
import { withValidations } from "components/ValidationsContext";

import NavLink from "./NavLink";
import PageIcon from "./icon-questionpage.svg?inline";
import CalculatedIcon from "./icon-summarypage.svg?inline";

const StyledPageItem = styled.li`
  padding: 0;
  margin: 0;
  position: relative;
  display: flex;
  align-items: center;
`;

const getIcon = pageType => {
  if (pageType === "CalculatedSummaryPage") {
    return CalculatedIcon;
  }
  return PageIcon;
};

export const UnwrappedPageNavItem = ({
  questionnaireId,
  page,
  match,
  validations,
  ...otherProps
}) => {
  let errorCount = page.validationErrorInfo.totalCount;
  if (validations) {
    const pageErrors = validations.pages.find(
      validations => validations.id === page.id
    );
    errorCount = pageErrors ? pageErrors.errorCount : 0;
  }
  return (
    <StyledPageItem data-test="page-item" {...otherProps}>
      <NavLink
        to={buildPagePath({
          questionnaireId,
          pageId: page.id,
          tab: match.params.tab,
        })}
        title={page.displayName}
        icon={getIcon(page.pageType)}
        data-test="nav-page-link"
        errorCount={errorCount}
      >
        {page.displayName}
      </NavLink>
    </StyledPageItem>
  );
};

UnwrappedPageNavItem.fragments = {
  PageNavItem: gql`
    fragment PageNavItem on Page {
      id
      title
      position
      displayName
      pageType

      ... on QuestionPage {
        confirmation {
          id
        }
        validationErrorInfo {
          totalCount
        }
      }
    }
  `,
};

UnwrappedPageNavItem.propTypes = {
  questionnaireId: PropTypes.string.isRequired,
  page: CustomPropTypes.page,
  match: CustomPropTypes.match,
  validations: PropTypes.shape({
    pages: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        errorCount: PropTypes.number.isRequired,
      }).isRequired
    ).isRequired,
  }),
};

export default flowRight(
  withRouter,
  withValidations
)(UnwrappedPageNavItem);
