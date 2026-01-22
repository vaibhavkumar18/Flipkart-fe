import React from "react";
import { Loader2 } from "lucide-react";

const LogoutLoader = () => {
    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center">
            <Loader2 className="animate-spin text-red-600 w-16 h-16 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">
                Logging you out...
            </h2>
            <p className="text-gray-500 mt-2">
                See you again soon.
            </p>
        </div>
    );
};

export default LogoutLoader;
