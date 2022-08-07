import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyD0SMmaaRVl0qhgJ-WCeVL4sI73tVMiJy0",
  authDomain: "web-dev-project-74d41.firebaseapp.com",
  projectId: "web-dev-project-74d41",
  storageBucket: "web-dev-project-74d41.appspot.com",
  messagingSenderId: "487997902885",
  appId: "1:487997902885:web:b25de8258eb853c9642fcc",
};

const firebaseApp = initializeApp(firebaseConfig);
// const auth = getAuth(firebaseApp);

export default firebaseApp;