import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable toast notification function
export function notify(message: string, type = 'default') {
  console.log('notify called');
  switch (type) {
    case 'info':
      toast.info(message);
      break;
    case 'success':
      toast.success(message);
      break;
    case 'warning':
      toast.warn(message);
      break;
    case 'error':
      toast.error(message);
      break;
    default:
      toast(message);
  }
}

export default function ToastMessage() {
  return (
    <div>
      <ToastContainer position="bottom-right" autoClose={3_000} hideProgressBar={false} newestOnTop />
    </div>
  );
}
