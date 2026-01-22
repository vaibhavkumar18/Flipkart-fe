import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginLoader = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center">
            <Loader2 className="animate-spin text-indigo-600 w-16 h-16 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">
                Logging you in...
            </h2>
            <p className="text-gray-500 mt-2">
                Please wait a moment.
            </p>
        </div>
    );
};

export default LoginLoader;
