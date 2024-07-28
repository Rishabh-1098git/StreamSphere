import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import SimplePeer from "simple-peer";

const Meeting = () => {
  const { meetingId } = useParams();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const peersRef = useRef([]);
  const userVideo = useRef();
  const remoteVideoRefs = useRef([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
        console.log("Local stream set");

        const meetingDoc = await getDoc(doc(db, "meetings", meetingId));
        if (!meetingDoc.exists()) {
          await setDoc(doc(db, "meetings", meetingId), {
            createdAt: new Date(),
          });
          setIsAdmin(true);
          console.log("Meeting created");
        }

        console.log("Meeting document setup complete");
      } catch (error) {
        console.error("Error initializing stream or Firestore:", error);
      }
    };

    init();
  }, [meetingId]);

  useEffect(() => {
    if (!localStream) return;

    const addPeer = async (initiator) => {
      try {
        const peerRef = await addDoc(
          collection(db, "meetings", meetingId, "peers"),
          {
            initiator: initiator,
            signalData: null,
          }
        );
        console.log("Peer added to Firestore with ID:", peerRef.id);
      } catch (error) {
        console.error("Error adding peer to Firestore:", error);
      }
    };

    const unsubscribe = onSnapshot(
      collection(db, "meetings", meetingId, "peers"),
      (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const peerData = change.doc.data();
            console.log("Peer added: ", peerData);
            console.log("Inside Unsubscribe -->> ");

            if (!localStream) {
              console.log("Local stream is not available.");
              return;
            }

            const peer = new SimplePeer({
              initiator: peerData.initiator,
              trickle: false,
              stream: localStream,
            });

            peer.on("signal", (signal) => {
              console.log(
                `Signaling data for ${
                  peerData.initiator ? "initiator" : "receiver"
                }:`,
                signal
              );
              updateDoc(
                doc(db, "meetings", meetingId, "peers", change.doc.id),
                {
                  signalData: signal,
                }
              );
            });

            peer.on("stream", (remoteStream) => {
              console.log("Received remote stream:", remoteStream);
              setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);
            });

            peer.on("error", (err) => console.error("Peer error:", err));

            if (peerData.signalData) {
              console.log("Signaling peer with data:", peerData.signalData);
              peer.signal(peerData.signalData);
            } else {
              console.log("No signaling data available yet for peer.");
            }

            peersRef.current.push({ peerID: change.doc.id, peer });
          }
        });
      }
    );

    addPeer(isAdmin);

    return () => unsubscribe();
  }, [localStream, meetingId, isAdmin]);

  useEffect(() => {
    remoteStreams.forEach((stream, index) => {
      if (remoteVideoRefs.current[index]) {
        remoteVideoRefs.current[index].srcObject = stream;
      }
    });
  }, [remoteStreams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <video ref={userVideo} muted autoPlay className="w-1/2" />
      {remoteStreams.map((stream, index) => (
        <video
          key={index}
          ref={(el) => (remoteVideoRefs.current[index] = el)}
          autoPlay
          className="w-1/2"
        />
      ))}
    </div>
  );
};

export default Meeting;
