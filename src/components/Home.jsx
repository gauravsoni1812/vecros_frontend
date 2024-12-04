/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Home = () => {
    const navigate = useNavigate();
    const authToken = Cookies.get("authToken");

    useEffect(() => {
        if (!authToken) {
            navigate("/sign-in");
            return;
        }

        try {
            const decodedToken = jwtDecode(authToken);
            const userId = decodedToken?.userId;
            const isAdmin = decodedToken?.isAdmin;

            if (!userId) {
                navigate("/sign-in");
            }
        } catch (error) {
            console.error("Invalid token:", error);
            navigate("/sign-in");
        }
    }, [authToken, navigate]);

    const { isPending, data } = useQuery({
        queryKey: ["getAllQuiz"],
        queryFn: () =>
            fetch(`https://backend-vecros-1.onrender.com/getAll`).then((res) => res.json()),
    });

    // Function to handle sign out
    const handleSignOut = () => {
        Cookies.remove("authToken");
        window.location.href = "/";
    };

    if (isPending) {
        return <div>......loading</div>;
    }

    return (
        <div className="">
            <h1 className="font-semibold text-center text-4xl py-2 my-10">
                {jwtDecode(authToken)?.isAdmin ? "Check the user results" : "Select the quiz to start"}
            </h1>

            <div className="grid grid-cols-4 gap-7 w-[90%] mx-auto">
                {data?.quizzes?.map((item, value) => {
                    const isAdmin = jwtDecode(authToken)?.isAdmin;
                    return (
                        <div key={value}>
                            <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-600 dark:border-neutral-700 dark:shadow-neutral-700/70">
                                <div className="p-4 md:p-5">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                        {item.name}
                                    </h3>
                                    {isAdmin ? (
                                        <Link
                                            className="mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                            to={`/score/${item.id}`}
                                        >
                                            Check Score
                                        </Link>
                                    ) : (
                                        <Link
                                            className="mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                            to={`/quiz/${item.id}`}
                                        >
                                            Start Quiz
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="text-center mt-4">
                <button
                    onClick={handleSignOut}
                    className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Home;
