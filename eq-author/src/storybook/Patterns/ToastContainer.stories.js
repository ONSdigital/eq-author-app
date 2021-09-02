import React, { useState } from "react";

import ToastContainer from "../../components/Toasts/ToastContainer";
import Toast from "../../components/Toasts/ToastContainer/Toast";
import ToastList from "../../components/Toasts/ToastContainer/ToastList";

export default {
  title: "Patterns/Toasts",
  component: ToastContainer,
};

// const toast = () => <ToastContainer toasts={toastArray} onDismissToast={handleDismissToast} />,;

let toastArray = [{ message: "Your toast is ready!", id: 1 }];
// let toastArray = [];

// const [toasts, setToasts] = useState([]);
const handleDismissToast = () => {
  return toastArray.filter(({ id }) => id !== 1);
  // console.log(
  //   `filter`,
  //   toastArray.filter(({ id }) => id !== 1)
  // );
  console.log(`toastArray`, toastArray);
  // toastArray = [];
};

const Template = (args) => {
  const [showToast, setShowToast] = useState(false);

  return (
    <>
      <button onClick={() => setShowToast(true)}>Get some toast!</button>
      {showToast && <ToastContainer {...args} />}
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  toasts: toastArray,
  onDismissToast: handleDismissToast,
};

// export const Horizontal = Template.bind({});
// Horizontal.args = {
//   horizontal: true,
//   children: [button("First"), button("Second")],
// };
