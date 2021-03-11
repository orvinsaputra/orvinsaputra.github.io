var isX = true;
var playerCanMove = false;
var player2CanMove = false;
var cells = [];
var player = 1;
var computer = 0;
var result = "";
var againstAI = false;
var gameSize = 3;
var lastMoveX = 0; //j
var lastMoveY = 0; //i
var pointsToWin = 3;

$(document).ready(function () {


    $("#dialog-confirm").dialog({
        resizable: false,
        height: 440,
        width: 380,
        modal: true,
        buttons: {
            "Brown": {
                click: function () {
                    isX = true;
                    gameSize = $('#tableSize').val();
                    pointsToWin = gameSize > 5 ? 5 : gameSize;
                    populateTable(gameSize);
                    $("#restartButton").show();
                    $(this).dialog("close");
                    startGame();
                },
                text: 'Brown',
                class: 'brownCell'
            },
            "Green": {
                click: function () {
                    isX = false;
                    gameSize = $('#tableSize').val();
                    pointsToWin = gameSize > 5 ? 5 : gameSize;
                    populateTable(gameSize);
                    $("#restartButton").show();
                    $(this).dialog("close");
                    startGame();
                },
                text: 'Green',
                class: 'greenCell'
            }
        }
    });

    $("#restartButton").click(function () {
        $("#dialog-confirm").dialog({
            resizable: false,
            height: 440,
            width: 380,
            modal: true,
            buttons: {
                "Brown": {
                    click: function () {
                        isX = true;
                        gameSize = $('#tableSize').val();
                        pointsToWin = gameSize > 5 ? 5 : gameSize;
                        populateTable(gameSize);
                        $(this).dialog("close");
                        result = "";
                        startGame();
                    },
                    text: 'Brown',
                    class: 'brownCell'
                },
                "Green": {
                    click: function () {
                        isX = false;
                        gameSize = $('#tableSize').val();
                        pointsToWin = gameSize > 5 ? 5 : gameSize;
                        populateTable(gameSize);
                        $(this).dialog("close");
                        result = "";
                        startGame();
                    },
                    text: 'Green',
                    class: 'greenCell'
                }
            }
        });
    })

    $("#tableSize").on("keydown", function(){//just a friendly parameter
        return false;
    })
});


function populateTable(tableSize) {
    $('#gameTable').empty();
    var padSize = ($(window).height() / tableSize) / 2.5;
    $("#infoTable").html("Objective : "+pointsToWin+" consecutive color box");
    $('#gameTable').append('<table id="tableStructure"></table>');
    for (var i = 0; i < tableSize; i++) {
        $('#tableStructure').append('<tr class="rowTable"></tr>');
    }
    $('.rowTable').each(function (index) {
        for (var j = 0; j < tableSize; j++) {

            var boxDiv = $('<td class="cell"></div>');
            boxDiv.css('padding', padSize + "px");
            $(this).append(boxDiv);
            var boxId = "c" + (index + 1) + (j + 1);
            boxDiv.attr('id', boxId);
            var boxIndexI = (index);
            boxDiv.attr('indexi', boxIndexI);
            var boxIndexJ = (j);
            boxDiv.attr('indexj', boxIndexJ);
        }
    });
}

function startGame() {
    resetGame();
    if (isX) { //determine gender
        player = 1;
        computer = 0;
    } else {
        player = 0;
        computer = 1;
    }
    $(".cell").on("click", function () {
        var validMove = false;
        if (playerCanMove) {
            //var sign = player === 0 ? "O" : "X";
            var sign = player === 0 ? "greenCell" : "brownCell";
            var i = $(this).attr("indexi");
            var j = $(this).attr("indexj");
            if (cells[i][j] === -1) {
                cells[i][j] = player;
                lastMoveY = i;
                lastMoveX = j;
                //$(this).html(sign);
                $(this).addClass(sign);
                validMove = true;
            } else {

            }
        } else if (player2CanMove) {

            //var sign = player === 0 ? "X" : "O";
            var sign = player === 0 ? "brownCell" : "greenCell";
            var i = $(this).attr("indexi");
            var j = $(this).attr("indexj");
            if (cells[i][j] === -1) {
                cells[i][j] = computer;
                lastMoveY = i;
                lastMoveX = j;
                //$(this).html(sign);
                $(this).addClass(sign);
                validMove = true;
            }
        }

        if (result == "" && validMove) {
            winner = winnerIs();
            if (winner === player) {
                $("#turnTable").html("Player 1 Won!");
                result = "Player 1";
                $(".highlighted").css("backdrop-filter", "brightness(0.7)");
                stopMoving();
            } else if (winner === computer) {
                $("#turnTable").html("Player 2 Won!");
                result = "Player 2";
                $(".highlighted").css("backdrop-filter", "brightness(0.7)");
                stopMoving();
            } else if (isTableFull(cells)) {
                result = "Draw";
                $("#turnTable").html("It's a Draw");
                stopMoving();
            } else {
                if (playerCanMove) {
                    playerCanMove = false;
                    if (againstAI) {
                        computerMove();
                    } else {
                        player2CanMove = true;
                        $("#turnTable").html("Player 2's Turn");
                    }
                } else {
                    playerCanMove = true;
                    player2CanMove = false;
                    $("#turnTable").html("Player 1's Turn");
                }
            }
        }

    });

    var rnd = Math.round(Math.random());
    if (rnd === 1) {
        playerCanMove = true;
        $("#turnTable").html("Player 1's Turn'");
    } else {
        if (againstAI) {
            computerMove();
        } else {
            player2CanMove = true;
            $("#turnTable").html("Player 2's Turn'");
        }
    }

}

function stopMoving() {
    playerCanMove = false;
    player2CanMove = false;
}


function isTableFull(cells) {
    for (var i in cells) { // can be replaced by a counter that go up every move until counts as table size, instead of looping
        for (var j in cells[i]) {
            if (cells[i][j] === -1) {
                return false;
            }
        }
    }
    return true;
}

function winnerIs() {
    var winCounter = 1;
    var temp = cells[lastMoveY][lastMoveX]; //cells i,j
    console.log("temp =" + temp);
    console.log(cells);
    console.log("last y " + lastMoveY);
    console.log("last x " + lastMoveX);
    var currentCountY = parseInt(lastMoveY);
    var currentCountX = parseInt(lastMoveX);
    var match = true;
    //check vertical
    while (currentCountY > 0 && match) {
        if (cells[currentCountY - 1][currentCountX] == temp) {
            currentCountY = currentCountY - 1; //move up
            console.log("move up");
        } else {
            match = false;
        }
    }
    match = true;
    console.log("current count y " + currentCountY);
    while (currentCountY < gameSize - 1 && match) {
        console.log(cells);
        console.log("y " + currentCountY);
        console.log("X " + currentCountX);
        console.log(cells[currentCountY + 1][currentCountX]);
        $("td[indexi=" + currentCountY + "][indexj=" + currentCountX + "]").addClass("highlighted");
        if (cells[currentCountY + 1][currentCountX] == temp) {
            winCounter++;
            currentCountY = currentCountY + 1; //count down
            console.log("count down" + winCounter);
            $("td[indexi=" + currentCountY + "][indexj=" + currentCountX + "]").addClass("highlighted");
        } else {
            match = false;
        }
        if (winCounter == pointsToWin) {
            if (temp == player) {
                console.log("player win vertical");
                return player;
            } else if (temp == computer) {
                console.log("computer win vertical");
                return computer;
            }
        }
    }
    match = true;
    winCounter = 1;
    currentCountY = parseInt(lastMoveY);
    currentCountX = parseInt(lastMoveX);
    $(".highlighted").removeClass("highlighted");
    //check horizontal
    while (currentCountX > 0 && match) {
        if (cells[currentCountY][currentCountX - 1] == temp) {
            currentCountX = currentCountX - 1; //move left
            console.log("move left");
        } else {
            match = false;
        }
    }
    match = true;
    while (currentCountX < gameSize - 1 && match) {
        $("td[indexi=" + currentCountY + "][indexj=" + currentCountX + "]").addClass("highlighted");
        if (cells[currentCountY][currentCountX + 1] == temp) {
            winCounter++;
            currentCountX = currentCountX + 1; //count right
            console.log("count right" + winCounter);
            $("td[indexi=" + currentCountY + "][indexj=" + currentCountX + "]").addClass("highlighted");
        } else {
            match = false;
        }
        if (winCounter == pointsToWin) {
            if (temp == player) {
                console.log("player win horizontal");
                return player;
            } else if (temp == computer) {
                console.log("computer win horizontal");
                return computer;
            }
        }
    }
    match = true;
    winCounter = 1;
    currentCountY = parseInt(lastMoveY);
    currentCountX = parseInt(lastMoveX);
    $(".highlighted").removeClass("highlighted");

    //check diagonal 1
    while (currentCountX > 0 && currentCountY > 0 && match) {
        if (cells[currentCountY - 1][currentCountX - 1] == temp) {
            currentCountX = currentCountX - 1; //move left
            currentCountY = currentCountY - 1; //move up
            console.log("move left up");
        } else {
            match = false;
        }
    }
    match = true;
    while (currentCountX < gameSize - 1 && currentCountY < gameSize - 1 && match) {
        console.log("y " + currentCountY);
        console.log("x " + currentCountX);
        $("td[indexi=" + currentCountY + "][indexj=" + currentCountX + "]").addClass("highlighted");
        if (cells[currentCountY + 1][currentCountX + 1] == temp) {
            winCounter++;
            currentCountX = currentCountX + 1; //count right
            currentCountY = currentCountY + 1; //count down
            console.log("count down right" + winCounter);
            $("td[indexi=" + currentCountY + "][indexj=" + currentCountX + "]").addClass("highlighted");
        } else {
            match = false;
        }
        if (winCounter == pointsToWin) {
            if (temp == player) {
                console.log("player win diagonal");
                return player;
            } else if (temp == computer) {
                console.log("computer win diagonal");
                return computer;
            }
        }
    }
    match = true;
    winCounter = 1;
    currentCountY = parseInt(lastMoveY);
    currentCountX = parseInt(lastMoveX);
    $(".highlighted").removeClass("highlighted");

    //check diagonal 2
    while (currentCountX > 0 && currentCountY < gameSize - 1 && match) {
        if (cells[currentCountY + 1][currentCountX - 1] == temp) {
            currentCountX = currentCountX - 1; //move left
            currentCountY = currentCountY + 1; //move down
            console.log("move 2");
        } else {
            match = false;
        }
    }
    match = true;
    while (currentCountX < gameSize - 1 && currentCountY > 0 && match) {
        $("td[indexi=" + currentCountY + "][indexj=" + currentCountX + "]").addClass("highlighted");
        if (cells[currentCountY - 1][currentCountX + 1] == temp) {
            winCounter++;
            currentCountX = currentCountX + 1; //count right
            currentCountY = currentCountY - 1; //count up
            console.log("count " + winCounter);
            $("td[indexi=" + currentCountY + "][indexj=" + currentCountX + "]").addClass("highlighted");
        } else {
            match = false;
        }
        if (winCounter == pointsToWin) {
            if (temp == player) {
                console.log("player win diagonal");
                return player;
            } else if (temp == computer) {
                console.log("computer win diagonal");
                return computer;
            }
        }
    }
    $(".highlighted").removeClass("highlighted");
}


function computerMove() {
    var moved = false;
    var sign = player === 0 ? "brownCell" : "greenCell";
    lastMoveY = parseInt(lastMoveY);
    lastMoveX = parseInt(lastMoveX);
    //To make AI harder with scalable table, simply path thru last player's move, for now it's just experimental
    while (!moved) {
        var whichWay = Math.floor(Math.random() * 9);
        if (whichWay == 0) {
            if (lastMoveY > 0 && cells[lastMoveY - 1][lastMoveX] === -1) {
                cells[lastMoveY - 1][lastMoveX] = computer;
                lastMoveY = lastMoveY - 1;
                $("td[indexi=" + lastMoveY + "][indexj=" + lastMoveX + "]").addClass(sign);
                moved = true;
            }
        } else if (whichWay == 1) {
            if (lastMoveY > 0 && lastMoveX < gameSize - 1 && cells[lastMoveY - 1][lastMoveX + 1] === -1) {
                cells[lastMoveY - 1][lastMoveX + 1] = computer;
                lastMoveY = lastMoveY - 1;
                lastMoveX = lastMoveX + 1;
                $("td[indexi=" + lastMoveY + "][indexj=" + lastMoveX + "]").addClass(sign);
                moved = true;
            }
        } else if (whichWay == 2) {
            if (lastMoveX < gameSize - 1 && cells[lastMoveY][lastMoveX + 1] === -1) {
                cells[lastMoveY][lastMoveX + 1] = computer;
                lastMoveX = lastMoveX + 1;
                $("td[indexi=" + lastMoveY + "][indexj=" + lastMoveX + "]").addClass(sign);
                moved = true;
            }
        } else if (whichWay == 3) {
            if (lastMoveY < gameSize - 1 && lastMoveX < gameSize - 1 && cells[lastMoveY + 1][lastMoveX + 1] === -1) {
                cells[lastMoveY + 1][lastMoveX + 1] = computer;
                lastMoveY = lastMoveY + 1;
                lastMoveX = lastMoveX + 1;
                $("td[indexi=" + lastMoveY + "][indexj=" + lastMoveX + "]").addClass(sign);
                moved = true;
            }
        } else if (whichWay == 4) {
            if (lastMoveY < gameSize - 1 && cells[lastMoveY + 1][lastMoveX] === -1) {
                cells[lastMoveY + 1][lastMoveX] = computer;
                lastMoveY = lastMoveY + 1;
                $("td[indexi=" + lastMoveY + "][indexj=" + lastMoveX + "]").addClass(sign);
                moved = true;
            }
        } else if (whichWay == 5) {
            if (lastMoveY < gameSize - 1 && lastMoveX > 0 && cells[lastMoveY + 1][lastMoveX - 1] === -1) {
                cells[lastMoveY + 1][lastMoveX - 1] = computer;
                lastMoveY = lastMoveY + 1;
                lastMoveX = lastMoveX - 1;
                $("td[indexi=" + lastMoveY + "][indexj=" + lastMoveX + "]").addClass(sign);
                moved = true;
            }
        } else if (whichWay == 6) {
            if (lastMoveX > 0 && cells[lastMoveY][lastMoveX - 1] === -1) {
                cells[lastMoveY][lastMoveX - 1] = computer;
                lastMoveX = lastMoveX - 1;
                $("td[indexi=" + lastMoveY + "][indexj=" + lastMoveX + "]").addClass(sign);
                moved = true;
            }
        } else if (whichWay == 7) {
            if (lastMoveX > 0 && lastMoveY > 0 && cells[lastMoveY - 1][lastMoveX - 1] === -1) {
                cells[lastMoveY - 1][lastMoveX - 1] = computer;
                lastMoveY = lastMoveY - 1;
                lastMoveX = lastMoveX - 1;
                $("td[indexi=" + lastMoveY + "][indexj=" + lastMoveX + "]").addClass(sign);
                moved = true;
            }
        } else if (whichWay > 7) {
            var arr = freeCells();
            var x = Math.floor(Math.random() * arr.length);
            if (arr.length >= 1) { // random move
                var i = arr[x][0];
                var j = arr[x][1];
                cells[i][j] = computer;
                lastMoveY = i;
                lastMoveX = j;
                $("td[indexi=" + lastMoveY + "][indexj=" + lastMoveX + "]").addClass(sign);
                moved = true;
            }
        }


    }

    winner = winnerIs();
    if (winner === computer) {
        $("#turnTable").html("Computer Won!");
        result = "Computer";
    } else if (isTableFull(cells)) {
        result = "Draw";
        $("#turnTable").html("It's a Draw");
    } else {
        playerCanMove = true;
        $("#turnTable").html("Player 1's Turn");
    }

}

function freeCells() {
    var arr = [];
    for (var i in cells) {
        for (var j in cells[i]) {
            if (cells[i][j] === -1) {
                arr.push([i, j]);
            }
        }
    }
    return arr;
}

function resetGame() {
    cells = [];
    result == "";
    if ($("#opponent").val() === "playercom") {
        againstAI = true;
    } else {
        againstAI = false;
    }
    lastMoveX = 0; //j
    lastMoveY = 0; //i
    for (var i = 0; i < gameSize; i++) {
        cells.push([]);
        for (var j = 0; j < gameSize; j++) {
            cells[i].push(-1);
        }
    }
}