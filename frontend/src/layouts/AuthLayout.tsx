import { Outlet } from "react-router-dom";
import Logo from "../components/Logo";
import { ToastContainer } from "react-toastify";

export default function AuthLayout() {
    return (
        <>
            <div className='bg-gray-800 min-h-screen'>
                <div className='py-4 mx-auto w-[400px]'>
                    <Logo/>
                    <div className='mt-5'>
                        <Outlet />
                    </div>
                </div>
            </div>
            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />
        </>
    )
}