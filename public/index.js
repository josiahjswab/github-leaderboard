function addUser() {
    var usernameInput = {
        "username": document.getElementById("user-input").value
    };
    $.post("/postUser", usernameInput);
    location.reload();
};

function populateTable() {
    $.get("/getUserScores", function (allScores) {
        allScores.sort((a, b) => b.points - a.points);
        var sortedData = allScores.map((student, i) =>
        `<tr>
            <td>${i + 1}</td>
            <td>
                <img style="border-radius: 50%;" src="${student.avatar}" width="50px" height="50px"/>
                ${student.username}
            </td>
            <td>${student.points}</td>
        </tr>`);
        $('tbody').append(sortedData);
        console.log(allScores)
    });
}

function deleteUser() {
    let github_id = document.getElementById("user-input").value;
    $.ajax({
        url: "/deleteUsers/" + github_id,
        type: 'DELETE',
        success: function(result) {
            alert("You Have Successfully Deleted User: " + result);
        }
    });
    location.reload();
}

function reverseRank() {
    var tbody = $('table tbody');
    tbody.html($('tr',tbody).get().reverse());
}

populateTable();
