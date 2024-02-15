import React, { useContext, useState } from 'react';
import { db } from "../firebase";
import { collection, query, where, getDocs, setDoc, updateDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { AuthContext } from '../context/AuthContext';

const Search = () => {
    const [username, setUsername] = useState("");
    const [err, setErr] = useState(false);
    const [user, setUser] = useState(null);
    const { currentUser } = useContext(AuthContext)
    const handleSearch = async () => {
        const q = query(
            collection(db, "users"),
            where("displayName", "==", username)
        );

        try {
            const querySnap = await getDocs(q);
            if (querySnap.empty) {
                setErr(true);
            } else {
                querySnap.forEach((doc) => {
                    setUser(doc.data());
                });
                setErr(false);
            }
        } catch (err) {
            // console.log(err);
            setErr(true);
        }
    };

    const handleKey = (e) => {
        if (e.code === "Enter") {
            handleSearch();
        }
    };
    const handleSelect = async () => {
        // if (!user) {
        //     // Handle case when user is not selected
        //     return;
        // }

        const combinedId =
            currentUser.uid > user.uid
                ? currentUser.uid + user.uid
                : user.uid + currentUser.uid;
        try {
            const res = await getDoc(doc(db, "chats", combinedId));

            if (!res.exists()) {
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
            }
        } catch (err) {
            // console.log(err)
        }
        setUser(null)
        setUsername("")
    };

    return (
        <div className='search'>
            <div className="searchForm">
                <input type='text'
                    placeholder='Find any user is available?'
                    onKeyDown={handleKey}
                    onChange={e => setUsername(e.target.value)}
                    value={username} />
            </div>
            {err && <span style={{ color: 'red' }}>User Not Found!</span>}
            {user && (
                <div className="userChat" onClick={() => handleSelect(username)}>
                    <img src={user.photoURL} alt="" />
                    <div className="userChatInfo">
                        <span>{user.displayName}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
