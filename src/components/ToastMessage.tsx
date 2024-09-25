import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
