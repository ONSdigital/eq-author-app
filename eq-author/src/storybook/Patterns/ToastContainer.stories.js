import React, { useState, useEffect } from "react";
import ToastContainer from "../../components/Toasts/ToastContainer";

export default {
  title: "Patterns/Toasts",
  component: ToastContainer,
};

const TemplateA = (args) => {
  const { toasts } = args;
  return <ToastContainer toasts={toasts} />;
};

const TemplateB = (args) => {
  const { toasts } = args;

  const [showToast, setShowToast] = useState(false);
  const [listOfToasts, setToasts] = useState(toasts);

  const handleDismissToast = (idToRemove) => {
    setToasts(listOfToasts.filter(({ id }) => id !== idToRemove));
  };

  useEffect(() => {
    if (listOfToasts.length === 0) {
      setShowToast(false);
      setToasts(toasts);
    }
  }, [listOfToasts, toasts]);

  return (
    <>
      <button onClick={() => setShowToast(true)}>Click me</button>
      {showToast && (
        <ToastContainer
          toasts={listOfToasts}
          onDismissToast={handleDismissToast}
        />
      )}
    </>
  );
};

export const Default = TemplateA.bind({});
Default.args = { toasts: [{ message: "Hello world", id: 1 }] };

export const Popup = TemplateB.bind({});
Popup.args = { toasts: [{ message: "I've been clicked", id: 1 }] };
