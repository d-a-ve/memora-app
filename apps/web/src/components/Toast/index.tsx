import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastNotif() {
  return <ToastContainer hideProgressBar={true} autoClose={5000} />;
}
