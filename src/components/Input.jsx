import React, { useContext, useState } from 'react';
import Img from "../img/addAvatar.png";
import { Timestamp, arrayUnion, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const Input = () => {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
    const [sending, setSending] = useState(false);

    const { currentUser } = useContext(AuthContext);
    const { data: chatData } = useContext(ChatContext);

    const isViewingOtherPersonChat = chatData && chatData.user && chatData.user.uid !== currentUser.uid;

    const handleSend = async () => {
        if (sending) return;
        setSending(true);

        if (!chatData || !chatData.chatId) {
            console.error("Chat data or chatId is missing.");
            setSending(false);
            return;
        }

        if (!text.trim() && !img) {
            console.error("Both text and image are empty. Please provide either text or an image to send.");
            setSending(false);
            return;
        }

        if (img) {
            const storageRef = ref(storage, `images/${uuid()}`);
            try {
                const uploadTask = uploadBytesResumable(storageRef, img);
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log("Upload is " + progress + "% done");
                    },
                    (error) => {
                        console.error("Error uploading image:", error);
                        setSending(false);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                            await updateDoc(doc(db, "chats", chatData.chatId), {
                                messages: arrayUnion({
                                    id: uuid(),
                                    text: text.trim(), // Include text with image
                                    senderId: currentUser.uid,
                                    date: Timestamp.now(),
                                    img: downloadURL,
                                }),
                            });
                            setSending(false);
                        }).catch(error => {
                            console.error("Error getting download URL:", error);
                            setSending(false);
                        });
                    }
                );
            } catch (error) {
                console.error("Error uploading image:", error);
                setSending(false);
            }
        } else {
            await updateDoc(doc(db, "chats", chatData.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                }),
            }).catch(error => {
                console.error("Error updating document:", error);
                setSending(false);
            });
            setSending(false);
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [chatData.chatId + ".lastMessage"]: {
                text: text.trim(),
            },
            [chatData.chatId + ".date"]: serverTimestamp(),
        }).catch(error => {
            console.error("Error updating userChats for current user:", error);
        });

        await updateDoc(doc(db, "userChats", chatData.user.uid), {
            [chatData.chatId + ".lastMessage"]: {
                text: text.trim(),
            },
            [chatData.chatId + ".date"]: serverTimestamp(),
        }).catch(error => {
            console.error("Error updating userChats for the other user:", error);
        });

        setText("");
        setImg(null);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className='input'>
            {isViewingOtherPersonChat && (
                <input type="text" placeholder='Type something...' onChange={e => setText(e.target.value)} value={text} onKeyPress={handleKeyPress} disabled={sending}></input>
            )}
            <div className="send">
                <input type="file" style={{ display: 'none' }} id="file" onChange={e => setImg(e.target.files[0])}></input>
                <label htmlFor='file'>
                    <img src={Img} alt="" />
                </label>
                <button onClick={handleSend} disabled={sending}>Send</button>
            </div>
        </div>
    );
};

export default Input;
