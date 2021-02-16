import React from "react";

export default (partialProps) => (Component) => (props) => (
  <Component {...partialProps} {...props} />
);
