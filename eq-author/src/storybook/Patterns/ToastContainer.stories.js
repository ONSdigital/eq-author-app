import React, { useState, useEffect } from "react";
import { get, flowRight } from "lodash";

import ToastContainer from "../../components/Toasts/ToastContainer";
import Toasts, { withShowToast } from "../../components/Toasts";

export default {
  title: "Patterns/Toasts",
  component: ToastContainer,
};

const Component = (props) => {
  const { showToast } = props;
  console.log(showToast);
  return <button>HEllo</button>;
};

const Template = () => {
  const Abc = flowRight(withShowToast)(Component);
  return <Abc />;
};

// export const Default = flowRight(withShowToast)(Template.bind({}));
export const Default = Template.bind({});
// Default.args = {
//   children: withShowToast,
// };
