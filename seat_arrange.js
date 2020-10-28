const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var output = "";
var input_length;
app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extend: true }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the seats as arrays in json notation? ', (answer) => {
    var array = JSON.parse(answer);
    input_length = array.length;
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < 1; j++) {
            var temp = 0;
            temp = array[i][j];
            array[i][j] = array[i][j + 1];
            array[i][j + 1] = temp;
        }
    }
    var rowSize = Math.max.apply(Math, array.map(e => e[0]));
    var colSize = Math.max.apply(Math, array.map(e => e[1]));

    //Identify seats
    var seats = seatMAandW(array);
    //Replace chars with numbers
    var obj = {};
    obj = allocateNumber("A", 1, seats, colSize, rowSize);
    obj = allocateNumber("W", obj.counter, obj.seats, colSize, rowSize);
    obj = allocateNumber("M", obj.counter, obj.seats, colSize, rowSize);
    seats = obj.seats;
    //print the seats
    output = outputSeat(seats, colSize, rowSize)
    console.log(output);
    rl.close();
});

function outputSeat(seats, colSize, rowSize) {
    var stringJ = ""
    for (var i = 0; i < colSize; i++) {
        for (var j = 0; j < rowSize; j++) {
            if (seats[j] == null || seats[j][i] == null) {
                for (var l = 0; l < seats[0][0].length; l++) {
                    stringJ += "- "
                    if (l + 1 == seats[0][0].length) {
                        stringJ += ",";
                    }
                }
                continue;
            }
            for (k = 0; k < seats[j][i].length; k++) {
                stringJ += (seats[j][i][k] + " ");
            }
            stringJ += ",";
        }
        stringJ += "\n"
    }
    return stringJ;
}

function seatMAandW(array) {
    var seats = [];
    for (var i = 0; i < array.length; i++)
        seats.push(Array(array[i][0]).fill().map(() => Array(array[i][1]).fill("M")));

    for (var i = 0; i < seats.length; i++) {
        for (var j = 0; j < seats[i].length; j++) {
            seats[i][j][0] = "A";
            seats[i][j][seats[i][j].length - 1] = "A";
        }
    }

    for (var i = 0; i < seats[0].length; i++)
        seats[0][i][0] = "W";
    for (var i = 0; i < seats[seats.length - 1].length; i++)
        seats[seats.length - 1][i][(seats[seats.length - 1][i].length) - 1] = "W";

    return seats;
}

function allocateNumber(val, counter, seats, colSize, rowSize) {
    for (var i = 0; i < colSize; i++) {
        for (var j = 0; j < rowSize; j++) {
            if (seats[j] == null || seats[j][i] == null)
                continue;
            for (k = 0; k < seats[j][i].length; k++) {
                if (seats[j] != null && seats[j][i] != null && seats[j][i][k] === val) {
                    seats[j][i][k] = counter;
                    counter++;
                }
            }
        }

    }
    return { seats: seats, counter: counter };
}

app.get('/', function(req, res) {
    res.render('seat_display.html', { name: output, length: input_length });
});
app.listen(5000, () => console.info('Application running on port 5000'));