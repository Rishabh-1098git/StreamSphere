import React from "react";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/main");
    }
  }, [user, loading]);

  function logoutFnc() {
    try {
      signOut(auth).then(() => {
        toast.success("User Signed out");
        navigate("/");
      });
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <header className="flex justify-between items-center px-6 py-3 h-16 text-xl rounded-lg shadow-md">
      <div className="font-mainfont text-3xl text-purple-700">StreamSphere</div>

      {!user ? (
        <button
          className="flex items-center justify-center font-mainfont bg-purple-600 text-white h-10 w-28 bg-opacity-80 rounded-3xl p-1 shadow-lg border-2 border-purple-600 hover:bg-purple-700 transition duration-300"
          onClick={() => navigate("/")}
        >
          <span className="mr-2">Sign In</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14m-7-7l7 7-7 7"
            ></path>
          </svg>
        </button>
      ) : (
        <button
          className="flex items-center justify-center font-mainfont bg-purple-600 text-white h-10 w-32 bg-opacity-80 rounded-3xl p-2 shadow-lg border-2 border-purple-600 hover:bg-purple-700 transition duration-300"
          onClick={logoutFnc}
        >
          <span className="mr-2">Logout</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14m-7-7l7 7-7 7"
            ></path>
          </svg>
        </button>
      )}
    </header>
  );
}

export default Header;
