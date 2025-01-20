// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDeFxB23T1Tq4jI_u71atYwaHtfdS785Us",
    authDomain: "analysis-9c7be.firebaseapp.com",
    projectId: "analysis-9c7be",
    storageBucket: "analysis-9c7be.firebasestorage.app",
    messagingSenderId: "149955444640",
    appId: "1:149955444640:web:73a30718df2c7334802ec5",
    measurementId: "G-PS26HKWD7S"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);

//as we uploading to the firebase we keep the percentage of the file has been uploaded, we set the state and call this callback function whenever we get the new update on the percentage.on
//ui we can upload the loading circle percentage.
export async function uploadFile(file:File, setProgress?:(progress:number)=> void){
    return new Promise((resolve, reject) => {
        try {
            const storageRef = ref(storage,file.name)
            const uploadTask = uploadBytesResumable(storageRef, file)

            //uploadTask give some callbacks, whenever the state changes it gives the snapshots of the state, these snapshots contains the information like a progress. 
            uploadTask.on('state_changed', snapshot => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) //this gives the percentage.
                if(setProgress) setProgress(progress)
                    switch(snapshot.state)
               {
                case 'paused': 
                console.log('upload is paused'); break;
                case 'running':
                    console.log('upload is running'); break;
               }

            }, error => {
                reject(error)
            },()=> {
                getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl =>{
                    resolve(downloadUrl);
                } )
            })
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}