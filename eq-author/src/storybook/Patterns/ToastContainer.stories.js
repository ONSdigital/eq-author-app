import React, { useState, useEffect } from "react";

import ToastContainer from "../../components/Toasts/ToastContainer";

export default {
  title: "Patterns/Toasts",
  component: ToastContainer,
};

let id = 1;
const Template = () => {
  const [showToast, setShowToast] = useState(false);
  const [toasts, setToasts] = useState([
    { message: "Your toast is ready!", id: id },
  ]);
  const handleDismissToast = (idToRemove) => {
    setToasts(toasts.filter(({ id }) => id !== idToRemove));
    // toastArray.filter(({ id }) => id !== 1);
    // toastArray = [];
    setShowToast(false);
    setToasts([{ message: "Your toast is ready!", id: id }]);
  };
  console.log(`showToast`, showToast);
  console.log(`toasts`, toasts);

  // useEffect(() => {
  // }, [showToast]);

  console.log(`id`, id);
  return (
    <>
      <button onClick={() => setShowToast(true)}>Get some toast!</button>
      {showToast && (
        <ToastContainer
          toasts={toasts}
          onDismissToast={handleDismissToast}
          // {...args}
        />
      )}
    </>
  );
};

export const Default = Template.bind({});
// Default.args = {
// toasts: toastArray,
// onDismissToast: handleDismissToast,
// };
