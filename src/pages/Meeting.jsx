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

        const meetingDoc = await getDoc(doc(db, "meetings", meetingId));
        if (!meetingDoc.exists()) {
          await setDoc(doc(db, "meetings", meetingId), {
            createdAt: new Date(),
          });
          setIsAdmin(true);
        }

        const unsubscribe = onSnapshot(
          collection(db, "meetings", meetingId, "peers"),
          (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                const peerData = change.doc.data();
                const peer = new SimplePeer({
                  initiator: peerData.initiator,
                  trickle: false,
                  stream,
                });

                peer.on("signal", (signal) => {
                  console.log(
                    `Signaling data for ${
                      peerData.initiator ? "initiator" : "receiver"
                    }:`,
                    signal
                  );
                  if (peerData.initiator) {
                    updateDoc(
                      doc(db, "meetings", meetingId, "peers", change.doc.id),
                      {
                        signalData: signal,
                      }
                    );
                  } else {
                    setDoc(
                      doc(db, "meetings", meetingId, "peers", change.doc.id),
                      {
                        signalData: signal,
                      }
                    );
                  }
                });

                peer.on("stream", (remoteStream) => {
                  console.log("Received remote stream:", remoteStream);
                  setRemoteStreams((prevStreams) => [
                    ...prevStreams,
                    remoteStream,
                  ]);
                });

                console.log("Signaling peer with data:", peerData.signalData);
                peer.signal(peerData.signalData);
                peersRef.current.push({ peerID: change.doc.id, peer });
              }
            });
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error("Error initializing stream or Firestore:", error);
      }
    };

    init();
  }, [meetingId]);

  const addPeer = async () => {
    try {
      await addDoc(collection(db, "meetings", meetingId, "peers"), {
        initiator: isAdmin,
        signalData: null,
      });
    } catch (error) {
      console.error("Error adding peer to Firestore:", error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      addPeer();
    }
  }, [isAdmin]);

  useEffect(() => {
    remoteStreams.forEach((stream, index) => {
      if (remoteVideoRefs.current[index]) {
        remoteVideoRefs.current[index].srcObject = stream;
      }
    });
  }, [remoteStreams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <video ref={userVideo} autoPlay muted className="w-1/2" />
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
