import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Collapsible from "components/Collapsible";
import { find } from "lodash";

import PageTitleInput from "./PageTitleInput";

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
  error,
  errors,
  onChange,
  onUpdate,
}) => {
  const pageDescriptionError =
    altFieldName && altError
      ? find(errors, { errorCode: altError })
      : find(errors, { errorCode: "PAGE_DESCRIPTION_MISSING" });

  const displayError =
    error === "PAGE_DESCRIPTION_MISSING"
      ? true
      : Boolean(pageDescriptionError?.errorCode);

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
            error={displayError}
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
        error={displayError}
        onUpdate={onUpdate}
        onChange={onChange}
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
