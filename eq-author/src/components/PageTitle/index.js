import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Collapsible from "components/Collapsible";
import { find } from "lodash";

import PageTitleInput from "./PageTitleInput";

import { pageDescriptionErrors } from "constants/validationMessages";

const PageTitleContainerWithoutCollapsible = styled.div``;

const PageTitleContainerWithCollapsible = styled.div`
  margin-left: 1em;
  margin-right: 1em;
`;

const PageTitleContainer = ({
  heading,
  inCollapsible,
  marginless,
  pageDescription,
  altFieldName,
  altError,
  errors,
  onChange,
  onUpdate,
}) => {
  const pageDescriptionError =
    altFieldName && altError
      ? find(errors, { errorCode: altError })
      : find(errors, { errorCode: "PAGE_DESCRIPTION_MISSING" });

  const allErrorCodes = Object.keys(pageDescriptionErrors);
  const errorCode = allErrorCodes.find(
    (code) => pageDescriptionError?.errorCode === code
  );

  const errorMessage = pageDescriptionErrors[errorCode];

  if (inCollapsible) {
    return (
      <Collapsible
        title="Page description"
        className="pageDescriptionCollapsible"
        dataTestIdPrefix="page-title-"
        defaultOpen
        withoutHideThis
        variant={marginless ? "marginlessContent" : "content"}
      >
        <PageTitleContainerWithCollapsible>
          <PageTitleInput
            heading={heading}
            pageDescription={pageDescription}
            altFieldName={altFieldName}
            onUpdate={onUpdate}
            onChange={onChange}
            errorMessage={errorMessage}
          />
        </PageTitleContainerWithCollapsible>
      </Collapsible>
    );
  }
  return (
    <PageTitleContainerWithoutCollapsible>
      <PageTitleInput
        heading={heading}
        pageDescription={pageDescription}
        altFieldName={altFieldName}
        onUpdate={onUpdate}
        onChange={onChange}
        errorMessage={errorMessage}
      />
    </PageTitleContainerWithoutCollapsible>
  );
};

PageTitleContainer.propTypes = {
  heading: PropTypes.string,
  inCollapsible: PropTypes.bool,
  marginless: PropTypes.bool,
  pageDescription: PropTypes.string,
  altFieldName: PropTypes.string,
  altError: PropTypes.string,
  error: PropTypes.string,
  errors: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default PageTitleContainer;
