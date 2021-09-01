import React from "react";

import ToastContainer from "../../components/Toasts/ToastContainer";
import Toast from "../../components/Toasts/ToastContainer/Toast";
import ToastList from "../../components/Toasts/ToastContainer/ToastList";

export default {
  title: "Patterns/Toasts",
  component: ToastContainer,
};

// const toast = (label = "Button") => <ToastContainer toasts={toastArray} onDismissToast={handleDismissToast} />,;

const toastArray = ["test message", "Id1"];

const Template = (args) => {
  // const toastArray = ["test message", Id1];
  // const handleDismissToast = (idToRemove) => {
  //   setToasts(toasts.filter(({ id }) => id !== idToRemove));
  // };
  return <ToastContainer {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  toasts: toastArray,
};

// export const Horizontal = Template.bind({});
// Horizontal.args = {
//   horizontal: true,
//   children: [button("First"), button("Second")],
// };
