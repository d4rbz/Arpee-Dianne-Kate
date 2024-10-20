// src/Dashboard.js
import React, { useEffect, useState } from 'react';
import { auth, db } from '../Firebase/Firebase'; // Import Firestore
import { onAuthStateChanged, signOut } from 'firebase/auth'; 
import { useNavigate } from 'react-router-dom'; 
import { collection, addDoc, onSnapshot, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore'; // Firestore methods

const Dashboard = () => {
  const navigate = useNavigate(); 
  const [users, setUsers] = useState([]); 
  const [currentUser, setCurrentUser] = useState(null); 
  const [showOverlay, setShowOverlay] = useState(false); 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation
  const [userToDelete, setUserToDelete] = useState(null); // State to hold the user ID for deletion
  const [overlayData, setOverlayData] = useState(null); // State to hold data for editing
  const [newUser, setNewUser] = useState({ fullName: '', notes: '' }); 
  const [currentPage, setCurrentPage] = useState(1); 
  const usersPerPage = 15; 

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is authenticated:", user); 
        setCurrentUser(user);
        
        // Fetch user-specific data
        const q = query(collection(db, 'users'), where('uid', '==', user.uid)); // Query for the user's collection
        const unsubscribeUsers = onSnapshot(q, (snapshot) => {
          const userData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUsers(userData); // Update users state
        });

        return () => unsubscribeUsers(); // Clean up user data subscription
      } else {
        console.log("User is not authenticated"); 
        navigate('/'); 
      }
    });

    return () => unsubscribeAuth(); 
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      console.log("User has logged out"); 
      navigate('/'); 
    } catch (error) {
      console.error("Error signing out: ", error); 
    }
  };

  const handleAddUser = () => {
    setNewUser({ fullName: '', notes: '' }); // Reset new user input
    setOverlayData(null); // Clear overlay data
    setShowOverlay(true); 
  };

  const handleSaveUser = async () => {
    if (newUser.fullName) {
      try {
        if (overlayData) {
          // Update existing user in Firestore
          await updateDoc(doc(db, 'users', overlayData.id), {
            fullName: newUser.fullName,
            notes: newUser.notes,
            dateAdded: new Date().toLocaleDateString(), // Update date if necessary
          });
        } else {
          // Save new user to Firestore
          await addDoc(collection(db, 'users'), {
            ...newUser,
            dateAdded: new Date().toLocaleDateString(),
            uid: currentUser.uid, // Store user ID to restrict access
          });
        }
        setShowOverlay(false); // Close overlay
      } catch (error) {
        console.error("Error saving user: ", error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      if (userToDelete) {
        await deleteDoc(doc(db, 'users', userToDelete)); // Delete user from Firestore
        console.log("User deleted:", userToDelete);
        setShowDeleteConfirm(false); // Close confirmation overlay
        setUserToDelete(null); // Clear user ID
      }
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  const confirmDelete = (id) => {
    setUserToDelete(id); // Set user ID to delete
    setShowDeleteConfirm(true); // Show confirmation overlay
  };

  const handleEdit = (user) => {
    setOverlayData(user); // Set user data for editing
    setNewUser({ fullName: user.fullName, notes: user.notes }); // Populate input fields
    setShowOverlay(true); // Show overlay for editing
  };

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome to the Dashboard!</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>

      {/* Add User Button */}
      <div className="mb-4">
        <button
          onClick={handleAddUser}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Add User
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto w-full rounded-lg shadow-lg bg-white">
        {users.length === 0 ? (
          <p className="text-gray-500 text-center my-4">No users available. Please add a user.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 border-b">Full Name</th>
                <th className="py-3 px-4 border-b">Date Added</th>
                <th className="py-3 px-4 border-b">Notes</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100 transition duration-200">
                  <td className="py-2 px-4 border-b">{user.fullName}</td>
                  <td className="py-2 px-4 border-b">{user.dateAdded}</td>
                  <td className="py-2 px-4 border-b">{user.notes}</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => handleEdit(user)} className="text-yellow-500 mr-2 hover:underline">Edit</button>
                    <button onClick={() => confirmDelete(user.id)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'} mx-1`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <p className="text-gray-500">Page {currentPage} of {totalPages}</p>
      </div>

      {/* Overlay for Adding/Editing User */}
      {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-2">{overlayData ? 'Edit User' : 'Add New User'}</h2>
            <div className="mb-2">
              <label className="block text-sm font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-semibold mb-1">Notes</label>
              <textarea
                value={newUser.notes}
                onChange={(e) => setNewUser({ ...newUser, notes: e.target.value })}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </div>
            <button
              onClick={handleSaveUser}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              {overlayData ? 'Update User' : 'Save User'}
            </button>
            <button onClick={() => setShowOverlay(false)} className="bg-gray-300 text-black py-2 px-4 rounded ml-2">Close</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="mt-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-4 rounded mr-2"
              >
                Yes, Delete
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="bg-gray-300 text-black py-2 px-4 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
