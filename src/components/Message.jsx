import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { serverTimestamp } from 'firebase/firestore'; // Import serverTimestamp

const Message = ({ message }) => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);
    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const formatMessageDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000); // Convert Firestore Timestamp to JavaScript Date
        return date.toLocaleTimeString(); // Format time using toLocaleTimeString()
    };

    return (
        <div className={`message ${message.senderId === currentUser.uid && "owner"}`}>
            <div className="messageInfo">
                <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" />
                <span>{formatMessageDate(message.date)}</span>
            </div>
            <div className="messageContent">
                <p>{message.text}</p>
                {message.img && <img src={message.img} alt="" />}
            </div>
            <div ref={ref}></div>
        </div>
    );
};

export default Message;
