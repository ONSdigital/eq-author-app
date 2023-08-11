import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { find } from "lodash";

import PageTitleInput from "./PageTitleInput";

import { pageDescriptionErrors } from "constants/validationMessages";

const PageTitleSegment = styled.div`
  margin-top: 2em;
`;

const Container = styled.div``;

const PageTitleContainer = ({
  heading,
  pageDescription,
  inputTitlePrefix,
  altFieldName,
  altError,
  errors,
  onChange,
  onUpdate,
}) => {
  const pageDescriptionError =
    altFieldName && altError
      ? find(errors, { errorCode: altError }) ||
        find(errors, {
          errorCode: "ERR_UNIQUE_PAGE_DESCRIPTION",
        })
      : find(errors, { errorCode: "PAGE_DESCRIPTION_MISSING" }) ||
        find(errors, {
          errorCode: "ERR_UNIQUE_PAGE_DESCRIPTION",
        });

  const allErrorCodes = Object.keys(pageDescriptionErrors);
  const errorCode = allErrorCodes.find(
    (code) => pageDescriptionError?.errorCode === code
  );

  const errorMessage = pageDescriptionErrors[errorCode];
  return (
    <Container>
      <PageTitleSegment data-test="page-title-container">
        <PageTitleInput
          heading={heading}
          pageDescription={pageDescription}
          inputTitlePrefix={inputTitlePrefix}
          altFieldName={altFieldName}
          onUpdate={onUpdate}
          onChange={onChange}
          errorMessage={errorMessage}
        />
      </PageTitleSegment>
    </Container>
  );
};

PageTitleContainer.propTypes = {
  heading: PropTypes.string,
  marginless: PropTypes.bool,
  pageDescription: PropTypes.string,
  inputTitlePrefix: PropTypes.string,
  altFieldName: PropTypes.string,
  altError: PropTypes.string,
  errors: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default PageTitleContainer;
