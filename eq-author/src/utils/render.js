import React from "react";
import ReactDOM from "react-dom";
import { curry } from "lodash";

const render = curry(function (target, props, Component) {
  ReactDOM.render(<Component {...props} />, target);
});

export default render;
