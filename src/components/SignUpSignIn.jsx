import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../../firebase.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { provider } from "../../firebase.js";
import Input from "./Input.jsx";
import Button from "./Button.jsx";

function SignUpSignin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);

  const navigate = useNavigate();

  function signupUsingEmail(event) {
    event.preventDefault(); // Prevent form submission
    setLoading(true);
    if (name !== "" && email !== "" && password !== "" && confirmPass !== "") {
      if (password === confirmPass) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            toast.success("User created!");
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPass("");
            setLoading(false);
            createDoc(user);
            navigate("/main");
          })
          .catch((error) => {
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
          });
      } else {
        toast.error("Password and Confirm Password don't match!");
        setPassword("");
        setConfirmPass("");
        setLoading(false);
      }
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

  function loginUsingEmail(event) {
    event.preventDefault(); // Prevent form submission
    setLoading(true);
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          toast.success("User Logged in");
          setLoading(false);
          console.log(user);
          navigate("/main");
        })
        .catch((error) => {
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
        });
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

  async function createDoc(user) {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc created");
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast.error("Doc already exists");
    }
  }

  function siginUsingGoogle(event) {
    event.preventDefault(); // Prevent form submission
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          createDoc(user);
          navigate("/main");
          toast.success("User Logged in");
          setLoading(false);
        })
        .catch((error) => {
          const errorMessage = error.message;
          toast.error(errorMessage);
        });
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  }

  return (
    <>
      {loginForm ? (
        <div className="flex flex-col justify-evenly h-[500px] w-[370px] mt-10 p-5 bg-white bg-opacity-90 shadow-2xl rounded-lg">
          <p className="text-center font-mainfont text-2xl">Login</p>
          <form onSubmit={loginUsingEmail}>
            <Input
              type="text"
              label="Email"
              placeholder="Enter your email"
              setState={setEmail}
            />
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              setState={setPassword}
            />

            <Button text="Login" />
            <div className="flex items-center justify-center mt-1">
              <span className="text-gray-600 mx-2">or</span>
            </div>
            <Button
              text="Login with Google"
              variant="google"
              onClick={siginUsingGoogle}
            />
            <div className="flex items-center justify-center mt-1">
              <span className="text-gray-600 mx-2">
                Or Already have an Account{" "}
                <p
                  className="inline font-mainfont text-purple-600 cursor-pointer"
                  onClick={() => {
                    setLoginForm(!loginForm);
                  }}
                >
                  Click Here
                </p>
              </span>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex flex-col justify-evenly h-[600px] w-[370px] mt-10 p-5 bg-white bg-opacity-90 shadow-2xl rounded-lg">
          <p className="text-center font-mainfont text-2xl">SignUp</p>
          <form onSubmit={signupUsingEmail}>
            <Input
              type="text"
              label="Email"
              placeholder="Enter your email"
              setState={setEmail}
            />
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              setState={setPassword}
            />
            <Input
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              setState={setConfirmPass}
            />
            <Input
              type="text"
              label="Username"
              placeholder="Choose a username"
              setState={setName}
            />
            <Button text="Sign Up" />
            <div className="flex items-center justify-center mt-1">
              <span className="text-gray-600 mx-2">or</span>
            </div>
            <Button
              text="Sign Up with Google"
              variant="google"
              onClick={siginUsingGoogle}
            />
            <div className="flex items-center justify-center ">
              <span className="text-gray-600 mx-2">
                Or Already have an Account{" "}
                <p
                  className="inline font-mainfont text-purple-600 cursor-pointer"
                  onClick={() => {
                    setLoginForm(!loginForm);
                  }}
                >
                  Click Here
                </p>
              </span>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default SignUpSignin;
