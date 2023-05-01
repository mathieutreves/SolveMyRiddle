import { Riddle } from './models/Riddle';
import { Rank } from './models/Rank';
import { Answer } from './models/Answer';

const SERVER_URL = 'http://localhost:3001/api/';

/**
 * A utility function for parsing the HTTP response.
 */
 function getJson(httpResponsePromise) {
    // server API always return JSON, in case of error the format is the following { error: <message> } 
    return new Promise((resolve, reject) => {
      httpResponsePromise
        .then((response) => {
          if (response.ok) {
           // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
           response.json()
              .then( json => resolve(json) )
              .catch((err) => reject({ error: 'Cannot parse server response' }))
          } else {
            // analyzing the cause of error
            response.json()
              .then(obj => reject(obj)) // error msg in the response body
              .catch(err => reject({ error: 'Cannot parse server response' })) // something else
          }
        })
        .catch(err => reject({ error: 'Cannot communicate' })) // connection error
    });
};

/** 
 * Function to handle the login
 */
const logIn = async (credentials) => {
    return getJson(fetch(SERVER_URL + 'sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
    }))
};

const isUserLoggedIn = async () => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    credentials: 'include'
  })
  )
};

const logOut = async () => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    method:'DELETE',
    credentials: 'include'
  })
  )
};

const getListRiddles = async (filter) => {
    return getJson(fetch(SERVER_URL + 'listRiddles' + filter, {
      credentials: 'include'
    })
    ).then(json => {
        return json.map((riddle) => new Riddle(riddle))
    }) 
};

const addRiddle = (riddle) => {
  return getJson(
    fetch(SERVER_URL + 'riddles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(riddle)
    })
  )
};

const setRiddleClosed = (riddle) => {
  return getJson(
    fetch(SERVER_URL + "riddles/" + riddle.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(riddle)
    })
  )
};

const getRanking = async () => {
  return getJson(
    fetch(SERVER_URL + 'ranking', {
      credentials: 'include'
    })
  ).then(json => {
    return json.map((ranking) => new Rank(ranking));
  })
};

const addAnswer = async (answer) => {
  return getJson(
    fetch(SERVER_URL + 'answers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(answer)
    })
  )
};

const getAnswers = async (id) => {
  return getJson(
    fetch(SERVER_URL + 'answers/' + id, {
      credentials: 'include'
    })
  ).then(json => {
    return json.map((answer) => new Answer(answer));
  })
};

const API = { logIn, isUserLoggedIn, logOut, getListRiddles, addRiddle, setRiddleClosed, getRanking, addAnswer, getAnswers };
export default API;