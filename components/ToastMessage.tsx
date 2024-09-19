import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable toast notification function
export default function ToastMessage() {
	return (
		<div>
			<ToastContainer
				autoClose={3_000}
				hideProgressBar={false}
				newestOnTop
				position="bottom-right"
			/>
		</div>
	);
}
