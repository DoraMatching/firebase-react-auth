import React from 'react';

import axios from 'axios';

import firebase from 'firebase/app';
import 'firebase/auth';

let firebaseConfig = {
  apiKey: "AIzaSyCMry94rbb_fD9tUpxlab7Bpuf_uqBWxWY",
  authDomain: "doramatching.firebaseapp.com",
  databaseURL: "https://doramatching.firebaseio.com",
  projectId: "doramatching",
  storageBucket: "doramatching.appspot.com",
  messagingSenderId: "1074902429461",
  appId: "1:1074902429461:web:bf78c961dd39da9370c31c",
  measurementId: "G-DSE4Q6V3H8"
};

firebase.initializeApp(firebaseConfig);

let provider = new firebase.auth.GithubAuthProvider().addScope('user,repo');

function App() {

  const loginWithGithub = async () => {
    try {
      const { credential, user } = await firebase.auth().signInWithPopup(provider);
      const { accessToken } = credential;
      console.log('RESULT', { user, accessToken });

      const { data } = await axios.post('https://dora.doramatching.tk/github', { user, accessToken });

      console.log('RESPONSE FROM API', data);

    } catch ({code, message, email, credential}) {
      console.error({code, message, email, credential});
    };
  }

  return (
    <div className="App">
      {/* <a href="https://dora.doramatching.tk/auth/github/login">Login with github</a> */}
      {/* <GitHubLogin clientId="3aaac93b657b7c0369b7"
        redirectUri="http://localhost:3000"
        scope={["repo,user,gist"]}
        onSuccess={onSuccess}
        onFailure={onFailure} /> */}
      <button onClick={loginWithGithub}>Login with Github</button>
    </div>
  );
}

export default App;
