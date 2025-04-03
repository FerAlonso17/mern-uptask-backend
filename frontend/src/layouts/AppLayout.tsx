import { Link, Navigate, Outlet } from "react-router-dom";
import Logo from "../components/Logo";
import NavMenu from "../components/NavMenu";
import { ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.css'
import { useAuth } from "../hooks/useAuth";

export default function AppLayout() {

    const { data, isError, isLoading } = useAuth()

    if(isLoading) return 'Loading...'
    if(isError) {
        return <Navigate to='/auth/login' />
    }

    if(data) return (
        <>
            <header className='bg-gray-800 py-5'>
                <div className=' max-w-screen-xl mx-auto flex flex-col lg:flex-row md:max-w-4/5 justify-between items-center'>
                    <div className='w-64'>
                        <Link to={'/'}>
                            <Logo />
                        </Link>
                    </div>
                    <NavMenu name={data.name}/>
                </div>
            </header>
            <section className='max-w-screen-xl mx-auto mt-10 p-5'>
                <Outlet />
            </section>
            <footer className='pt-5 pb-1'>
                <p className='text-center'>
                    All rights reserved {new Date().getFullYear()}
                </p>
            </footer>
            <ToastContainer
                pauseOnFocusLoss={false}
                pauseOnHover={false}
            />
        </>
    )
}
