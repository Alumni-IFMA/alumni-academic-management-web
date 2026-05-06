import { Outlet } from "react-router-dom";

export function AuthLayout() {
    return (
        <div className="bg-dark-green min-h-screen py-2 m-0 2xl:py-10">
            <div className="max-w-[1024px] w-[90%] bg-biege mx-auto flex flex-col rounded-4xl py-5 2xl:py-12 px-10">
                <Outlet />
            </div>
        </div>
    )
}