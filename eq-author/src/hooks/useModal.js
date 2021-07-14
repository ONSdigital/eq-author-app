import React, { useState, useCallback } from "react";

// Convenience wrapper for invoking modals - automates handling of `isOpen` state
export default ({ component: Modal, onConfirm, onCancel, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = useCallback(
    (...args) => {
      onConfirm(...args);
      setIsOpen(false);
    },
    [onConfirm]
  );

  const handleCancel = useCallback(
    (...args) => {
      // eslint-disable-next-line no-unused-expressions
      onCancel?.(...args);
      setIsOpen(false);
    },
    [onCancel]
  );

  return [
    useCallback(() => setIsOpen(true), []),
    useCallback(
      () => (
        <Modal
          {...props}
          isOpen={isOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      ),
      [onConfirm, onCancel, props]
    ),
  ];
};
