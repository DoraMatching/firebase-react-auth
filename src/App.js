import React from 'react';
import './index.css';

import axios from 'axios';

import firebase from 'firebase/app';
import 'firebase/auth';

import { Doughnut } from 'react-chartjs-2';

const API_URL = 'https://api.dev.doramatching.tk';

const firebaseConfig = {
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

const hashColor = function (str) { // util
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

export default class App extends React.Component {
  state = {
    name: '',
    charData: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: []
      }]
    }
  }

  getLangs = async () => {
    try {
      const { credential } = await firebase.auth().signInWithPopup(provider);
      const { accessToken } = credential;

      const { data } = await axios.post(`${API_URL}/github/langs`, { accessToken });

      console.log('RESPONSE FROM API', data);

      const { langs, name } = data;

      console.log({ langs, name });

      let newChar = this.state.charData;

      Object.keys(langs).map(name => {
        const { labels, datasets } = newChar;
        const { data, backgroundColor, hoverBackgroundColor } = datasets[0];

        const hashColorStr = hashColor(name);

        newChar = {
          labels: [...labels, name],
          datasets: [{
            data: [...data, langs[name]],
            backgroundColor: [...backgroundColor, hashColorStr],
            hoverBackgroundColor: [...hoverBackgroundColor, hashColorStr]
          }]
        };
      })

      this.setState({
        name,
        charData: newChar
      });

    } catch ({ code, message, email, credential }) {
      console.error({ code, message, email, credential });
    };
  }

  loginWithGithub = async () => {
    try {
      const { credential, user } = await firebase.auth().signInWithPopup(provider);
      const { accessToken } = credential;
      console.log('RESULT', { user, accessToken });

      const { data } = await axios.post(`${API_URL}/github`, { user, accessToken });

      console.log('RESPONSE FROM API', data);

    } catch ({ code, message, email, credential }) {
      console.error({ code, message, email, credential });
    };
  }

  render() {
    return (
      <div className="App" >
        {/* <a href="https://dora.doramatching.tk/auth/github/login">Login with github</a> */}
        {/* <GitHubLogin clientId="3aaac93b657b7c0369b7"
          redirectUri="http://localhost:3000"
          scope={["repo,user,gist"]}
          onSuccess={onSuccess}
          onFailure={onFailure} /> */}
        <button onClick={this.loginWithGithub} > Login with Github</button >
        <button onClick={this.getLangs}>Get my langs</button>
        <hr />

        <h1>Github user: {this.state.name}</h1>

        <div style={{maxHeight: '500px' }}>
          <Doughnut data={this.state.charData} />
        </div>
      </div >
    );
  }
}
