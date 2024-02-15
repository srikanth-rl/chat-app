import React, { useContext, useState } from 'react';
import Add from "../img/add.png";
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../context/ChatContext';

const Chat = () => {
    const { data } = useContext(ChatContext);
    const [showProfile, setShowProfile] = useState(false);

    const toggleProfile = () => {
        setShowProfile(!showProfile);
    };

    return (
        <div className='chat'>
            <div className="chatInfo">
                <span>{data.user?.displayName}</span>
                <div className="chatIcons">
                    {showProfile ? (
                        <img src={data.user?.photoURL} alt=" " className="profileImage" onClick={toggleProfile} />
                    ) : (
                        <img src={Add} alt="" onClick={toggleProfile} />
                    )}
                </div>
            </div>
            <Messages />
            <Input />
        </div>
    );
};

export default Chat;
