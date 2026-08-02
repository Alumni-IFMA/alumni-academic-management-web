import { Outlet } from "react-router-dom";
import { AuthRibbon } from "./components/AuthRibbon";

export function AuthLayout() {
    return (
        <div className="relative overflow-hidden bg-dark-green min-h-screen py-2 m-0 2xl:py-10 flex items-center justify-center">
            <AuthRibbon />
            <div className="relative z-10 max-w-[1024px] w-[90%] bg-biege mx-auto flex flex-col rounded-4xl py-5 2xl:py-12 px-10">
                <Outlet />
            </div>
        </div>
    )
}