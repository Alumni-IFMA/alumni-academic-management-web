import { Outlet } from "react-router-dom";

export function AuthLayout() {
    return (
        <div className="bg-dark-green min-h-screen py-24">
            <div className="max-w-[1024px] w-[90%] bg-biege mx-auto flex flex-col rounded-4xl py-18 px-10">
                <Outlet />
            </div>
        </div>
    )
}