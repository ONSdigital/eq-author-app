import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Collapsible from "components/Collapsible";

import PageTitleInput from "./PageTitleInput";

const PageTitleContainerWithoutCollapsible = styled.div``;

const PageTitleContainerWithCollapsible = styled.div`
  margin-left: 1em;
  margin-right: 1em;
`;

export class PageTitleContainer extends React.Component {
  render() {
    const { inCollapsible, pageDescription, error, onChange, onUpdate } =
      this.props;

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
              error={error}
            />
          </PageTitleContainerWithCollapsible>
        </Collapsible>
      );
    }
    return (
      <PageTitleContainerWithoutCollapsible>
        <PageTitleInput
          pageDescription={pageDescription}
          error={error}
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
  error: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default PageTitleContainer;
