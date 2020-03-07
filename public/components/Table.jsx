import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Table() {
  const [userScores, setUserScores] = useState([]);
  const [addUser, setAddUser] = useState('');

  function populateTable() {
    axios.get('/getUserScores')
    .then((res) => setUserScores(res.data))
    // .then(() => console.log(userScores))
    .catch((err) => console.error(err));
  }

  function postUser() {
    axios.post('/postUser', {gitHubUserName: addUser})
    .then((res) => console.log(res))
    .then(() => setAddUser(''))
    .then(() => populateTable())
    .catch((err) => console.error(err));
  }

  function deleteUser() {
    axios.delete('/deleteUsers/' + addUser)
    .then((res) => console.log(res))
    .then(() => setAddUser(''))
    .then(() => populateTable())
    .catch((err) => console.error(err));
  }

  useEffect(() => {
    populateTable();
  },[])

  let sortedByScore = userScores.sort((a, b) => b.points - a.points);

  return(
    <div>
      <div>
        <label>Github Username</label>
        <input type="text" placeholder='i.e. RoyHobbs' name='addUser' onChange={(e) => setAddUser(e.target.value)}/>
        <button onClick={() => deleteUser()}>Delete</button>
        <button onClick={() => postUser()}>Add</button>
      </div>

      <table>
        <thead>
          <tr>
            <td></td>
            <td>Name</td>
            {/* <td>Week</td> */}
            <td>Score</td>
            <td>Rank</td>
          </tr>
        </thead>
        <tbody>
          {
          sortedByScore.map((person, i) => {
            // {console.log({person, i})}
            return (
              <tr key={person.id}>
                <td><img style={{borderRadius: '50%'}} src={person.avatar} width="50px" height="50px"/></td>
                <td>{person.username}</td>
                {/* <td></td> */}
                <td>{person.points}</td>
                <td>{i + 1}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}