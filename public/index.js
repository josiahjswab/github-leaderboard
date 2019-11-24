var mockData = [
    {
        username: 'firstuser',
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
