// TODO: this is a work in progress, should be able to add new users to the list to track

function addUser() {
    var usernameInput = {
        "username": document.getElementById("user-input").value
    };
    $.post("/postUser", usernameInput);
};

function populateTable() {
    $.get("/getUserScores", function (allScores) {
        allScores.sort((a, b) => b.points - a.points);
        var sortedData = allScores.map((student, i) =>
            `<tr>
            <td>${i + 1}</td>
            <td>${student.username}</td>
            <td>${student.points}</td>
        </tr>`);
        $('tbody').append(sortedData);
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
}

function reverseRank() {
    var tbody = $('table tbody');
    tbody.html($('tr',tbody).get().reverse());
}

populateTable();
