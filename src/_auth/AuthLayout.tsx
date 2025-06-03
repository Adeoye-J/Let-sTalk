import { Outlet, Navigate } from "react-router-dom"

const AuthLayout = () => {

    const isAuthenticated = false; // Replace with actual authentication logic

    return (
        <>
            {isAuthenticated ? (
                <Navigate to="/" replace />
            ) : (
                <>
                    <div className="flex flex-1 justify-center items-center flex-col py-10">
                        <Outlet />
                    </div>

                    <img src="/assets/images/side-img.svg" alt="logo" className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat" />
                </>
            )}
        </>
    )
}

export default AuthLayout