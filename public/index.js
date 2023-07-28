// import firebase from "firebase/app";
// import "firebase/compat/database";


const firebaseConfig = {

    apiKey: "AIzaSyBQ0wZTA14UCOJaHJ8DcHPHGPr3BdfcT6w",

    authDomain: "unichat-2a034.firebaseapp.com",

    databaseURL: "https://unichat-2a034-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId: "unichat-2a034",

    storageBucket: "unichat-2a034.appspot.com",

    messagingSenderId: "291619298133",

    appId: "1:291619298133:web:8d488a239dabad789c6ddc",

    measurementId: "G-DXZSHXMQ1C"

};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Initialize Realtime Database and get a reference to the service
const db = firebase.database();

console.log("db", db)


const username = prompt("Please Tell Us Your Name");
console.log("username:", username)

const messageForm = document.getElementById('message-form')
messageForm.addEventListener('submit', sendMessage)

function sendMessage(e) {
    e.preventDefault();

    // get values to be submitted
    const timestamp = Date.now();
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value;

    // clear the input box
    messageInput.value = "";

    //auto scroll to bottom
    document
        .getElementById("messages")
        .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

    
    console.log("db, db.ref", db, db.ref)
    // create db collection and send in the data
    db.ref("messages/" + timestamp).set({
        username,
        message,
    });
}

const fetchChat = db.ref("messages/");

fetchChat.on("child_added", function (snapshot) {
    const messages = snapshot.val();
    const message = `<li class=${username === messages.username ? "sent" : "receive"
        }><span>${messages.username}: </span>${messages.message}</li>`;
    // append the message on the page
    document.getElementById("messages").innerHTML += message;
});