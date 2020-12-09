import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Error from "components/preview/Error";

const Title = styled.h1`
  font-size: 1.4em;
  margin: 0 0 1em;
  word-wrap: break-word;
`;

const PageTitle = ({ title, missingText = "Missing Page Title" }) => {
  let pageTitle = title && title.replace(/(<p[^>]+?>|<p>|<\/p>)/gim, "");
  return (
    <Title data-test="page-title">
      {pageTitle ? (
        /*  eslint-disable-next-line react/no-danger */
        <div dangerouslySetInnerHTML={{ __html: pageTitle }} />
      ) : (
        <Error data-test="no-title" large>
          {missingText}
        </Error>
      )}
    </Title>
  );
};

PageTitle.propTypes = {
  title: PropTypes.string,
  missingText: PropTypes.string,
};

export default PageTitle;
