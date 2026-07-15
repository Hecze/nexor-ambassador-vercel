import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDocs, updateDoc, deleteDoc, query, where, onSnapshot, writeBatch } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

auth.languageCode = "es";

export { signInWithPopup, signOut, collection, doc, setDoc, getDocs, updateDoc, deleteDoc, query, where, onSnapshot, writeBatch };
export type { User };
