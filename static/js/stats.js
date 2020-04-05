//Calendar Constants
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayCount = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const monthSkipDay = [2, 5, 6, 2, 5, 0, 2, 5, 1, 3, 6, 1];

//Build & Populate Calendar

function buildCalendar(month, compDays) {
    let j = 0;
    let totalDays = dayCount[month - 1];

    for (let i = 1; i <= totalDays + monthSkipDay[month - 1]; i++) {
        let currDay = i - monthSkipDay[month - 1]
        let calendarField = document.createElement("div");
        calendarField.classList.add("calendarField");

        if (i % 7 === 0) {
            calendarField.classList.add("calendarRight");
        }
        else if ((i - 1) % 7 === 0 && currDay !== 1) {
            calendarField.classList.add("calendarLeft");
        }

        if (currDay >= 29) calendarField.classList.add("calendarBot");

        if (currDay > totalDays - 7) {
            calendarField.style.borderBottom = "0.5px #202225 solid";
        }

        if (currDay === totalDays) {
            calendarField.style.borderRight = "0.5px #202225 solid";
        }

        let calendarDay = document.createElement("p");
        calendarDay.classList.add("calendarDay", "text", "unselectable");
        calendarDay.innerText = currDay;

        calendarCont.appendChild(calendarField);
        calendarField.appendChild(calendarDay);

        if (currDay < 1) {
            calendarField.classList.add("hidden");
            calendarDay.classList.add("hidden");
        }

        if (currDay === compDays[j]) {
            let calendarCheckmark = document.createElement("IMG");
            calendarCheckmark.classList.add("calendarCheckmark");
            calendarCheckmark.src = "\\static\\images\\checkmark.png";
            calendarField.appendChild(calendarCheckmark)

            j++;
        }
    }
}


//Set Checklist Date & Build Calendar

let curr_date = {};
let completionDays = [];

fetch("date_time/get_curr")
    .then(res => res.json())
    .then(function (data) {
        curr_date = data;
        sbHeaderChecklistDay.innerText = weekdays[data.weekday];
        sbHeaderDateTimeChecklist.innerText = months[data.month - 1] + " " + data.day + ", " + data.year;

        return new Promise((resolve, reject) => { resolve(data.month); })
    })
    .then(function (month) {
        return fetch("/checklist/get_completion", {
            method: "post",
            credentials: "same-origin",
            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ month: month }),
            credentials: 'include'
        })
    })
    .then(res => res.json())
    .then(function (data) {
        completionDays = data.sort((a, b) => a - b);
        buildCalendar(curr_date.month, completionDays);
    });