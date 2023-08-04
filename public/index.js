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


let provider = new firebase.auth.GoogleAuthProvider();
let username
firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
        console.log("logged in")
        //let credential = result.credential;  

        // // This gives you a Google Access Token. You can use it to access the Google API.
        // let token = credential.accessToken;
        // // The signed-in user info.
        // let user = result.user;
        // // IdP data available in result.additionalUserInfo.profile.
        // console.log("token, user", token, user)



        //Access the current signed-in user
        const user = firebase.auth().currentUser;

        if (user) {
            // User is signed in, you can access the user details
            const displayName = user.displayName; // User's display name
            const email = user.email; // User's email address
            const photoURL = user.photoURL; // User's profile photo URL
            const uid = user.uid; // User's unique ID

            console.log("Display Name:", displayName);
            console.log("Email:", email);
            console.log("Profile Photo URL:", photoURL);
            console.log("User UID:", uid);

            username = displayName
            const usernameDisplay = document.getElementById('username')
            usernameDisplay.style.display = 'block'
            usernameDisplay.innerText = 'Welcome, ' + username
        } else {
            // User is not signed in, or there was an error during sign-in
            console.log("User is not signed in.");
        }

    }).catch((error) => {
        // Handle Errors here.  
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.log(error)
    });


// Initialize Realtime Database and get a reference to the service
const db = firebase.database();


const roomForm = document.getElementById('room-form')
roomForm.addEventListener('submit', joinRoom)

let roomId;
let fetchChat;

function loadRoomList() {
    const roomList = document.getElementById('rooms')
    db.ref("units").on('child_added', snapshot => {
        const roomButton = document.createElement('button')
        roomButton.innerText = snapshot.key
        roomButton.addEventListener('click', () => joinRoomByButton(snapshot.key))
        roomList.appendChild(roomButton)
    })

}
loadRoomList()

function joinRoom(e) {
    e.preventDefault()
    roomId = document.getElementById('room-input').value
    document.getElementById('message-form').style.display = 'block'
    document.getElementById('messages').style.display = 'block'
    document.getElementById('back-btn').style.display = 'block'
    document.getElementById('room-form').style.display = 'none'
    document.getElementById('room-list').style.display = 'none'
    document.getElementById('title').innerText = roomId
    fetchChat = db.ref("units/" + roomId + "/")
    fetchChat.on("child_added", function (snapshot) {
        const messages = snapshot.val();
        const message = `<li class=${username === messages.username ? "sent" : "receive"
            }><span>${messages.username}: </span>${messages.message}</li>`;
        // append the message on the page
        document.getElementById("messages").innerHTML += message;
    });
}

function joinRoomByButton(id) {
    console.log("join room", id)
    roomId = id
    document.getElementById('message-form').style.display = 'block'
    document.getElementById('messages').style.display = 'block'
    document.getElementById('back-btn').style.display = 'block'
    document.getElementById('room-form').style.display = 'none'
    document.getElementById('room-list').style.display = 'none'
    document.getElementById('title').innerText = roomId
    fetchChat = db.ref("units/" + roomId + "/")
    fetchChat.on("child_added", function (snapshot) {
        const messages = snapshot.val();
        const message = `<li class=${username === messages.username ? "sent" : "receive"
            }><span>${messages.username}: </span>${messages.message}</li>`;
        // append the message on the page
        document.getElementById("messages").innerHTML += message;
    });
}

const backButton = document.getElementById('back-btn')
backButton.addEventListener('click', backClicked)

function backClicked() {
    fetchChat = undefined
    roomId = undefined
    document.getElementById('message-form').style.display = 'none'
    document.getElementById('messages').style.display = 'none'
    document.getElementById('back-btn').style.display = 'none'
    document.getElementById('room-form').style.display = 'block'
    document.getElementById('title').innerText = 'UniChat'
    document.getElementById('room-list').style.display = 'block'
    document.getElementById('messages').innerHTML = ""
}

const messageForm = document.getElementById('message-form')
console.log("messageForm", messageForm)
messageForm.addEventListener('submit', sendMessage)

function sendMessage(e) {
    console.log("sendMessage wiht username, roomId: ", username, roomId)

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

    // create db collection and send in the data
    db.ref("units/" + roomId + "/" + timestamp).set({
        username,
        message,
    }).catch(err => console.log(err));
}


