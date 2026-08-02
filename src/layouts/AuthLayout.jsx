import { Outlet, useLocation } from "react-router-dom";
import { AuthRibbon } from "./components/AuthRibbon";

const COMPACT_CARD_PATHS = ["/auth/set-password"];

export function AuthLayout() {
    const { pathname } = useLocation();
    const isCompact = COMPACT_CARD_PATHS.includes(pathname);

    return (
        <div className="relative overflow-hidden bg-dark-green min-h-screen py-2 m-0 2xl:py-10 flex items-center justify-center">
            <AuthRibbon />
            <div
                className={`relative z-10 bg-biege mx-auto flex flex-col rounded-4xl ${
                    isCompact
                        ? "max-w-[480px] w-[92%] sm:w-[85%] py-6 px-6 sm:px-8"
                        : "max-w-[1024px] w-[95%] sm:w-[90%] py-5 2xl:py-12 px-4 sm:px-10"
                }`}
            >
                <Outlet />
            </div>
        </div>
    )
}