import React, { useState } from "react";
import meetingImg from "../assets/Meeting3.png";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";

function MainPage() {
  const [meetingCode, setMeetingCode] = useState("");
  const navigate = useNavigate();

  const createMeeting = async () => {
    const meetingRef = await addDoc(collection(db, "meetings"), {
      createdAt: new Date(),
    });
    navigate(`/meeting/${meetingRef.id}`);
  };

  const joinMeeting = async () => {
    const meetingDoc = await getDoc(doc(db, "meetings", meetingCode));
    if (meetingDoc.exists()) {
      navigate(`/meeting/${meetingCode}`);
    } else {
      alert("Meeting code does not exist!");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center h-screen w-full p-10 lg:p-20 bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="lg:mx-8 text-center lg:text-left lg:w-1/2 mb-8 lg:mb-0 mt-10 lg:mt-0">
        <h1 className="font-mainfont font-bold text-4xl lg:text-7xl text-purple-700">
          Video calls and meetings for everyone
        </h1>
        <p className="font-mainfont text-lg lg:text-xl mt-4 lg:mt-6 text-gray-700">
          Connect, collaborate, and celebrate from anywhere with Google Meet
        </p>
        <div className="flex flex-col lg:flex-row items-center lg:justify-start justify-center mt-6 space-y-4 lg:space-y-0 lg:space-x-4">
          <button
            className="h-auto w-40 lg:w-32 p-3 lg:p-2 bg-purple-700 font-mainfont text-white rounded-lg shadow-lg hover:bg-purple-800"
            onClick={createMeeting}
          >
            New Meeting
          </button>
          <div className="flex items-center">
            <input
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              type="text"
              className="h-auto w-64 lg:w-60 p-3 lg:p-2 font-mainfont text-gray-700 bg-white rounded-3xl shadow-lg focus:outline-none text-center"
              placeholder="Enter meeting code"
            />
            <button
              className="ml-2 h-auto w-20 lg:w-16 p-3 lg:p-2 bg-blue-600 text-white font-mainfont rounded-lg shadow-lg hover:bg-blue-700"
              onClick={joinMeeting}
            >
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="lg:w-1/2 sm:w-2/3">
        <img src={meetingImg} alt="Meeting" className="w-full h-auto" />
      </div>
    </div>
  );
}

export default MainPage;
