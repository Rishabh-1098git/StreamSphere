// src/pages/Meeting.js
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Peer from "simple-peer";
import { db } from "../../firebase";
import {
  doc,
  onSnapshot,
  collection,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
function Meeting() {
  const { meetingId } = useParams();
  const { currentUser } = useAuthState(auth);
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const myVideo = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    const meetingRef = doc(db, "meetings", meetingId);
    onSnapshot(meetingRef, (doc) => {
      if (doc.exists() && doc.data().admin === currentUser.uid) {
        setIsAdmin(true);
      }
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;

        const callRef = collection(db, "calls");
        onSnapshot(callRef, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const peer = new Peer({
                initiator: false,
                trickle: false,
                stream,
              });
              peer.on("signal", (data) => {
                addDoc(callRef, {
                  meetingId,
                  signal: data,
                });
              });

              peer.on("stream", (userStream) => {
                setPeers((peers) => [
                  ...peers,
                  { id: change.doc.id, stream: userStream },
                ]);
              });

              peer.signal(change.doc.data().signal);
              peersRef.current.push({ id: change.doc.id, peer });
            }
          });
        });
      });
  }, [meetingId, currentUser]);

  const createPeer = async () => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    const callRef = collection(db, "calls");
    peer.on("signal", (data) => {
      addDoc(callRef, {
        meetingId,
        signal: data,
      });
    });

    peer.on("stream", (userStream) => {
      setPeers((peers) => [...peers, { id: peer.id, stream: userStream }]);
    });

    peersRef.current.push({ id: peer.id, peer });
  };

  const removePeer = async (peerId) => {
    const peerToRemove = peersRef.current.find((p) => p.id === peerId);
    if (peerToRemove) {
      peerToRemove.peer.destroy();
      await deleteDoc(doc(db, "calls", peerId));
      setPeers(peers.filter((p) => p.id !== peerId));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex">
        <video playsInline muted ref={myVideo} autoPlay className="w-1/2" />
        {peers.map((peer, index) => (
          <div key={index} className="relative">
            <video
              playsInline
              ref={(ref) => ref && (ref.srcObject = peer.stream)}
              autoPlay
              className="w-1/2"
            />
            {isAdmin && (
              <button
                onClick={() => removePeer(peer.id)}
                className="absolute top-0 right-0 bg-red-600 text-white p-2"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      <button onClick={createPeer} className="btn btn-primary mt-4">
        Add Participant
      </button>
    </div>
  );
}

export default Meeting;
