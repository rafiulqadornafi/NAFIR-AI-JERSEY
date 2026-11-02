import { initializeApp } from 'firebase/app';
import { getFirestore, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
try {
  setLogLevel('silent');
} catch (e) {}
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export default app;
