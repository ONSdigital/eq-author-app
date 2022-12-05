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

export class PageTitleContainer extends React.Component {
  render() {
    const { inCollapsible, pageDescription, errors, onChange, onUpdate } =
      this.props;

    const pageDescriptionError = find(errors, {
      errorCode: "PAGE_DESCRIPTION_MISSING",
    });

    if (inCollapsible) {
      return (
        <Collapsible
          title="Page description"
          className="pageDescriptionCollapsible"
          defaultOpen
          withoutHideThis
          variant="content"
        >
          <PageTitleContainerWithCollapsible>
            <PageTitleInput
              pageDescription={pageDescription}
              onUpdate={onUpdate}
              onChange={onChange}
              error={Boolean(pageDescriptionError?.errorCode)}
            />
          </PageTitleContainerWithCollapsible>
        </Collapsible>
      );
    }
    return (
      <PageTitleContainerWithoutCollapsible>
        <PageTitleInput
          pageDescription={pageDescription}
          error={Boolean(pageDescriptionError?.errorCode)}
          onUpdate={onUpdate}
          onChange={onChange}
        />
      </PageTitleContainerWithoutCollapsible>
    );
  }
}

PageTitleContainer.propTypes = {
  inCollapsible: PropTypes.bool,
  pageDescription: PropTypes.string,
  errors: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default PageTitleContainer;
