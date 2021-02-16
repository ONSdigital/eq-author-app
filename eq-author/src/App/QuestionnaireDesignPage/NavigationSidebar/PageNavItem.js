import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import CustomPropTypes from "custom-prop-types";
import gql from "graphql-tag";
import { get } from "lodash";

import { buildPagePath } from "utils/UrlUtils";

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

const StyledNavLink = styled.div`
  width: 100%;
  a svg {
    margin-left: 0.85em;
    margin-right: 0.25em;
  }
`;

const getIcon = (pageType) => {
  if (pageType === "CalculatedSummaryPage") {
    return CalculatedIcon;
  }
  return PageIcon;
};

export const UnwrappedPageNavItem = ({
  questionnaireId,
  page,
  match,
  ...otherProps
}) => {
  const errorCount = get(page, "validationErrorInfo.totalCount", 0);
  return (
    <StyledPageItem data-test="page-item" {...otherProps}>
      <StyledNavLink>
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
      </StyledNavLink>
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
      validationErrorInfo {
        id
        errors {
          id
          type
          field
          errorCode
        }
        totalCount
      }
      ... on QuestionPage {
        alias
        confirmation {
          id
          qCode
        }
        answers {
          id
          label
          secondaryLabel
          secondaryLabelDefault
          type
          properties
          qCode
          displayName
          ... on BasicAnswer {
            secondaryQCode
          }
          ... on MultipleChoiceAnswer {
            options {
              id
              label
              qCode
            }
            mutuallyExclusiveOption {
              id
              label
              qCode
            }
          }
        }
      }
    }
  `,
};

UnwrappedPageNavItem.propTypes = {
  questionnaireId: PropTypes.string.isRequired,
  page: CustomPropTypes.page,
  match: CustomPropTypes.match.isRequired,
  validations: PropTypes.shape({
    pages: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        errorCount: PropTypes.number.isRequired,
      }).isRequired
    ).isRequired,
  }),
};

export default withRouter(UnwrappedPageNavItem);
