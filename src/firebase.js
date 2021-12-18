import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
});
const firestore = app.firestore();
export const database = {
  folders: firestore.collection('folders'),
  documents: firestore.collection('documents'),
  files: firestore.collection('files'),
  formatDoc: (doc) => ({ id: doc.id, ...doc.data() }),
  getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp,
};

export const storage = app.storage();
export const auth = app.auth();
export default app;
export { firebase };
export { firestore };
