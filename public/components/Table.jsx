import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Table() {
  const [userScores, setUserScores] = useState([]);

  function populateTable() {
    console.log('hit')
    axios.get('/getUserScores')
    .then((res) => setUserScores(res.data))
    .then(() => console.log(userScores))
    .catch((err) => console.error(err));
  }

  useEffect(() => {
    populateTable();
  },[])

  let sortedByScore = userScores.sort((a, b) => b.points - a.points);
  console.log({sortedByScore})

  return(
    <div>
      <div>
        <label>Github Username</label>
        <input type="text" placeholder='i.e. RoyHobbs'/>
        <button>Delete</button>
        <button>Add</button>
      </div>

      <table>
        <thead>
          <tr>
            <td></td>
            <td>Name</td>
            <td>Week</td>
            <td>Score</td>
            <td>Rank</td>
          </tr>
        </thead>
        <tbody>
          {
          sortedByScore.map((person, i) => {
            {console.log({person, i})}
            return (
              <tr key={person.id}>
                <td><img style={{borderRadius: '50%'}} src={person.avatar} width="50px" height="50px"/></td>
                <td>{person.username}</td>
                <td></td>
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