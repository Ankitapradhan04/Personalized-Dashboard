// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { auth, firestore, storage } from '../firebase';

function Profile() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      setUser(user);
      if (user) {
        const userDoc = await firestore.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUsername(userData.username);
          setProfilePicUrl(userData.profilePicUrl);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      const userRef = firestore.collection('users').doc(user.uid);
      await userRef.set({ username, profilePicUrl }, { merge: true });
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    const storageRef = storage.ref();
    const fileRef = storageRef.child(`profilePics/${user.uid}`);
    await fileRef.put(file);
    const fileUrl = await fileRef.getDownloadURL();
    setProfilePicUrl(fileUrl);
  };

  return (
    <div>
      <h1>Profile</h1>
      <form onSubmit={handleProfileUpdate}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input type="file" onChange={handleProfilePicUpload} />
        {profilePicUrl && <img src={profilePicUrl} alt="Profile" />}
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;
