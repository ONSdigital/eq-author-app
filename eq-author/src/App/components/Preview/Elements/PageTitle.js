import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Error from "App/components/Preview/Error/Error";

const Title = styled.h1`
  font-size: 1.4em;
  margin: 0 0 1em;
`;

const PageTitle = ({ title }) => {
  let pageTitle = title && title.replace(/(<p[^>]+?>|<p>|<\/p>)/gim, "");
  return (
    <Title>
      {pageTitle ? (
        /*  eslint-disable-next-line react/no-danger */
        <div dangerouslySetInnerHTML={{ __html: pageTitle }} />
      ) : (
        <Error data-test="no-title" large>
          Missing Page Title
        </Error>
      )}
    </Title>
  );
};

PageTitle.propTypes = {
  title: PropTypes.string
};

export default PageTitle;
