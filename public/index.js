var mockData = [
    {
        username: 'firstUser',
        points: 5012
    },
    {
        username: 'secondUser',
        points: 9182
    },
    {
        username: 'thirdUser',
        points: 1736
    }
]

var competitors = {};

// TODO: this is a work in progress, should be able to add new users to the list to track
function addUser() {
   var userInput = document.getElementById("user-input").value;
   console.log(userInput)
   userInput.appendTo("competitors");
   console.log(competitors)
};

function populateTable(){
    mockData.sort( (a, b) => b.points-a.points);

    var sortedData = mockData.map((student, i) =>
        `<tr>
            <td>${i+1}</td>
            <td>${student.username}</td>
            <td>${student.points}</td>
        </tr>`);
    $('tbody').append(sortedData);
}

populateTable();
