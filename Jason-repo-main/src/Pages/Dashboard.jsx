import { motion, AnimatePresence } from "framer-motion";
import { FaSignOutAlt } from 'react-icons/fa'; // Import the logout icon
import { useEffect, useState } from "react";
import { firestore } from '../Firebase/Firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore'; 
import { signOut, createUserWithEmailAndPassword } from 'firebase/auth'; // Import createUserWithEmailAndPassword
import { auth } from '../Firebase/Firebase'; // Import your Firebase Auth instance
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

// Import images
import slide2 from "../Assets/Images/slide-2.jpg";
import slide3 from "../Assets/Images/slide-3.jpg";
import slide4 from "../Assets/Images/slide-4.jpg";
import slide5 from "../Assets/Images/slide-5.jpg";
import slide6 from "../Assets/Images/slide-6.jpg";
import slide7 from "../Assets/Images/slide-7.jpg";
import slide8 from "../Assets/Images/slide-8.jpg";
import slide9 from "../Assets/Images/slide-9.jpg";
import slide10 from "../Assets/Images/slide-10.jpg";
import slide11 from "../Assets/Images/slide-11.jpg";
import slide12 from "../Assets/Images/slide-12.jpg";
import slide13 from "../Assets/Images/slide-13.jpg";
import slide14 from "../Assets/Images/slide-14.jpg";
import slide15 from "../Assets/Images/slide-15.jpg";
import slide16 from "../Assets/Images/slide-16.jpg";
import slide17 from "../Assets/Images/slide-17.jpg";
import slide18 from "../Assets/Images/slide-18.jpg";
import slide19 from "../Assets/Images/slide-19.jpg";
import slide20 from "../Assets/Images/slide-20.jpg";

const slides = [
    slide2, slide3, slide4, slide5, slide6, slide7, slide8,
    slide9, slide10, slide11, slide12, slide13, slide14, slide15, slide16,
    slide17, slide18, slide19, slide20,
];

function getRandomScale() {
    return Math.random() * 0.1 + 1;
}

function getRandomIndex(currentIndex) {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * slides.length);
    } while (newIndex === currentIndex);
    return newIndex;
}

function Dashboard() {
    const [index, setIndex] = useState(0);
    const [zoomScale, setZoomScale] = useState(1);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showUpdateOverlay, setShowUpdateOverlay] = useState(false); 
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false); 
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null); 
    const [userToDelete, setUserToDelete] = useState(null); 
    const navigate = useNavigate(); // Initialize useNavigate for redirection

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("User authenticated:", user);
                fetchUsers();
            } else {
                console.log("No user authenticated, redirecting to home...");
                navigate("/"); // Redirect to home if not authenticated
            }
        });
        
        return () => unsubscribe(); // Cleanup subscription
    }, [navigate]);

    // Fetch users from Firestore
    const fetchUsers = async () => {
        try {
            const usersCollection = collection(firestore, 'Users');
            const usersSnapshot = await getDocs(usersCollection);
            const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Fetched Users:", usersData);
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    // Add a new user
    const addUser = async () => {
        if (name && email && password) {
            try {
                // Create user in Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user; // This is the authenticated user object

                // Add user details to Firestore
                const usersCollection = collection(firestore, 'Users');
                await addDoc(usersCollection, {
                    uid: user.uid, // Store the Firebase UID for reference
                    name,
                    email,
                });

                fetchUsers(); // Refresh the user list
                closeOverlay(); // Close the overlay
            } catch (error) {
                console.error("Error adding user:", error);
            }
        }
    };

    // Update user details
    const updateUser = async () => {
        if (currentUserId && name && email) {
            try {
                const userDoc = doc(firestore, 'Users', currentUserId);
                await updateDoc(userDoc, {
                    name,
                    email,
                });
                fetchUsers();
                closeUpdateOverlay();
            } catch (error) {
                console.error("Error updating user:", error);
            }
        }
    };

    // Delete user
    const deleteUser = async () => {
        if (userToDelete) {
            try {
                const userDoc = doc(firestore, 'Users', userToDelete);
                await deleteDoc(userDoc);
                fetchUsers();
                closeDeleteOverlay();
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    // Close overlays
    const closeOverlay = () => {
        setShowOverlay(false);
        setName("");
        setEmail("");
        setPassword("");
    };

    const closeUpdateOverlay = () => {
        setShowUpdateOverlay(false);
        setName("");
        setEmail("");
        setPassword("");
        setCurrentUserId(null); 
    };

    const closeDeleteOverlay = () => {
        setShowDeleteOverlay(false);
        setUserToDelete(null); 
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Optionally redirect to login page
            window.location.href = "/"; // Adjust as needed
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => getRandomIndex(prevIndex));
            setZoomScale(getRandomScale());
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const fadeZoomAnimation = {
        initial: { opacity: 0, scale: zoomScale },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: zoomScale },
        transition: { duration: 2, ease: "easeInOut" },
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-transparent overflow-hidden">
            <div className="relative w-full h-full">
                <AnimatePresence>
                    <motion.img
                        key={index}
                        src={slides[index]}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        initial={fadeZoomAnimation.initial}
                        animate={fadeZoomAnimation.animate}
                        exit={fadeZoomAnimation.exit}
                        transition={fadeZoomAnimation.transition}
                    />
                </AnimatePresence>
            </div>

            {/* Dim Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

            {/* User Table Container */}
            <div className="absolute pt-32 top-0 left-0 w-full flex items-center justify-center p-4 z-50">
                <div className="bg-white bg-opacity-20 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg max-w-3xl w-full">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-black text-center">User List</h2>

                    {/* Flex container for buttons */}
                    <div className="flex justify-between mb-4">
                        <div className="flex-1">
                            <button
                                onClick={() => setShowOverlay(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                            >
                                Add User
                            </button>
                        </div>
                        <button onClick={handleLogout} className="text-red-500 hover:text-red-700 flex items-center">
                            <FaSignOutAlt className="mr-1" /> Logout
                        </button>
                    </div>

                    {/* User Table */}
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white text-black border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="py-2 border-b">Name</th>
                                        <th className="py-2 border-b">Email</th>
                                        <th className="py-2 border-b">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-100 transition duration-200">
                                            <td className="py-2 border-b">{user.name}</td>
                                            <td className="py-2 border-b">{user.email}</td>
                                            <td className="py-2 border-b">
                                                <button
                                                    onClick={() => {
                                                        setShowUpdateOverlay(true);
                                                        setCurrentUserId(user.id);
                                                        setName(user.name);
                                                        setEmail(user.email);
                                                    }}
                                                    className="text-blue-500 hover:text-blue-700 mr-2"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowDeleteOverlay(true);
                                                        setUserToDelete(user.id);
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay for Adding User */}
            {showOverlay && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Add User</h2>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border p-2 mb-4 w-full"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 mb-4 w-full"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border p-2 mb-4 w-full"
                        />
                        <div className="flex justify-between">
                            <button onClick={closeOverlay} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                            <button onClick={addUser} className="bg-green-500 text-white px-4 py-2 rounded">Add User</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay for Updating User */}
            {showUpdateOverlay && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Update User</h2>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border p-2 mb-4 w-full"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 mb-4 w-full"
                        />
                        <div className="flex justify-between">
                            <button onClick={closeUpdateOverlay} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                            <button onClick={updateUser} className="bg-blue-500 text-white px-4 py-2 rounded">Update User</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay for Deleting User */}
            {showDeleteOverlay && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Delete User</h2>
                        <p>Are you sure you want to delete this user?</p>
                        <div className="flex justify-between mt-4">
                            <button onClick={closeDeleteOverlay} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                            <button onClick={deleteUser} className="bg-red-500 text-white px-4 py-2 rounded">Delete User</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
