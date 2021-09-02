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
  };

  useEffect(() => {
    if (toasts.length === 0) {
      setShowToast(false);
      setToasts([{ message: `Your toast is ready!" ${id}`, id: ++id }]);
    }
  }, [toasts]);

  return (
    <>
      <button onClick={() => setShowToast(true)}>Get some toast!</button>
      {showToast && (
        <ToastContainer toasts={toasts} onDismissToast={handleDismissToast} />
      )}
    </>
  );
};

export const Default = Template.bind({});
// Default.args = {
// };
