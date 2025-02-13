// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCxLnB1WTL5k4exUpuZBa76NLLdhtSydA",
  authDomain: "projectmusicapp-59cc0.firebaseapp.com",
  projectId: "projectmusicapp-59cc0",
  storageBucket: "projectmusicapp-59cc0.appspot.com",
  messagingSenderId: "651662434361",
  appId: "1:651662434361:web:7d541e0ba665b9ca8e6de8",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
isSupported().then((supported)=> {
  if(supported){
    const analytics = getAnalytics(app);
  }
})

export const storage = getStorage(app);

//as we uploading to the firebase we keep the percentage of the file has been uploaded, we set the state and call this callback function whenever we get the new update on the percentage.on
//ui we can upload the loading circle percentage.
export async function uploadFile(
  file: File,
  setProgress?: (progress: number) => void,
) {
  return new Promise((resolve, reject) => {
    try {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      //uploadTask give some callbacks, whenever the state changes it gives the snapshots of the state, these snapshots contains the information like a progress.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100); //this gives the percentage.
          if (setProgress) setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("upload is paused");
              break;
            case "running":
              console.log("upload is running");
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl as string);
          });
        },
      );
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
