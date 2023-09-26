const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs")
const PORT = 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const homePath = path.join(__dirname, "public", "home.html");

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "ThursdaY", "Friday", "Saturday"];

console.log("in app.js")

//Use FileSystem to readfiles, change them using html.replace, Searches the document to where to change, add current time.

// Callfunction to calculate amount of days till newyears evening 

function daysUntilNewYearsEve(currentDate) {
    const currentYear = currentDate.getFullYear();
    const newYearsEveDate = new Date(currentYear, 11, 31); // NB of 0 index of months.
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // hours*minutes*secs*ms
    
    // Calculate the difference in days, Uses ceil, so you only get upperboundaries of date (only resets at 23:59:59:999)
    const daysToReveillon = Math.ceil((newYearsEveDate - currentDate) / millisecondsPerDay);
    // Corrected adding milliseconds perday and division.
    console.log((newYearsEveDate - currentDate)/millisecondsPerDay)
    // Gets in milliseconds here, useless dataformat.
    console.log((newYearsEveDate - currentDate))
    return daysToReveillon;
}

app.get("/", (req, res) => {

    //utf8 necessary else you get binary/bytecode which doesnt translate into text as easily.
    fs.readFile(homePath, "utf8", (error, html) => {
        if (error) 
        {
            console.error("Error - Follow stacktrace for bugfinding:", error);
        }
        const currentDate = new Date();
        const currentTime = currentDate.toLocaleTimeString();
        const currentDay = weekdays[new Date().getDay()];
        const currentMonth = monthNames[new Date().getMonth()]
        const currentYear = currentDate.getFullYear();
        const daysToReveillon = daysUntilNewYearsEve(currentDate);


        //Escape charachter inside string \", else you have a badtime. 
        html = html.replace("<span id=\"current-time\"></span>", currentTime);
        html = html.replace("<span id=\"current-day\"></span>",currentDay);
        html = html.replace("<span id=\"current-month\"></span>",currentMonth);
        html = html.replace("<span id=\"current-year\"></span>",currentYear);
        html = html.replace("<span id=\"days-to-reveillon\"></span>",daysToReveillon);

        res.send(html);
    });
});
console.log(Date());

/* {  
  <p>Current Time: <span id="current-time"></span></p>
  <p>Current day: <span id="current-day"></span></p>
  <p>Current Week: <span id="current-week"></span></p>
  <p>Current Month: <span id="current-month"></span></p>
  <p>Current Year: <span id="current-year"></span></p>
  <p>Days until New Years Eve!: <span id="days-to-reveillon"></span></p>
 */

// Locale Time String
/*  */// UTC
//console.log(new Date());
// Epoch timestamp / Unix 
//console.log(Date.now());

app.listen(PORT, (error) => {
    if (error) {
        console.log("an error has been found, Stacktrace:", error);
        return;
    }
    console.log("server is running on port", PORT)
});

module.exports = app;


