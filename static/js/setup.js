//Constants

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


//Get Current Date

//Get POST Cookie

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


//Adjust Feed Height

function adjustFeedHeight() {
    setTimeout(() => {
        const feedbar = document.querySelector("#feedPlaceholder");
        if (daySetup.offsetHeight > sidebar.offsetHeight) feedbar.style.height = `${daySetup.offsetHeight}px`;
        else feedbar.style.height = `${sidebar.offsetHeight}px`;
    }, 50);
}


//Build Checklist Sidebar

const sidebar = document.querySelector("#sidebar");
const bodyCont = document.querySelector("#bodyCont");

const sbHelpImageChecklist = document.createElement("IMG");
sbHelpImageChecklist.id = "sbHelpImageChecklist";
sbHelpImageChecklist.classList.add("unselectable");
sbHelpImageChecklist.src = "\\static\\images\\helpIcon.png";

const checklistCheckmark = document.createElement("IMG");
checklistCheckmark.id = "checklistCheckmark";
checklistCheckmark.classList.add("unselectable", "hidden");
checklistCheckmark.src = "\\static\\images\\checkmark.png";

const sbHeaderChecklistDayCont = document.createElement("div");
sbHeaderChecklistDayCont.id = "sbHeaderChecklistDayCont";

const sbHeaderChecklistDay = document.createElement("p");
sbHeaderChecklistDay.id = "sbHeaderChecklistDay";
sbHeaderChecklistDay.classList.add("text", "unselectable");

const resetIcon = document.createElement("IMG");
resetIcon.id = "resetIcon";
resetIcon.classList.add("unselectable");
resetIcon.src = "\\static\\images\\resetIcon.png";

const sbHeaderDateTimeChecklistCont = document.createElement("div");
sbHeaderDateTimeChecklistCont.id = "sbHeaderDateTimeChecklistCont";

const sbHeaderDateTimeChecklist = document.createElement("p");
sbHeaderDateTimeChecklist.id = "sbHeaderDateTimeChecklist";
sbHeaderDateTimeChecklist.classList.add("text", "unselectable");

const sbChecklistStatsCont1 = document.createElement("div");
sbChecklistStatsCont1.id = "sbChecklistStatsCont1";

const sbChecklistStatsCont2 = document.createElement("div");
sbChecklistStatsCont2.id = "sbChecklistStatsCont2";

const sbChecklistStats1 = document.createElement("p");
sbChecklistStats1.id = "sbChecklistStats1";
sbChecklistStats1.classList.add("text", "unselectable");
sbChecklistStats1.innerText = "Tasks: 12 / 36";

const sbChecklistStats2 = document.createElement("p");
sbChecklistStats2.id = "sbChecklistStats2";
sbChecklistStats2.classList.add("text", "unselectable");
sbChecklistStats2.innerText = "Consecutive Days: 13";

const checklistProgress = document.createElement("PROGRESS");
checklistProgress.id = "checklistProgress";
checklistProgress.classList.add("round");
checklistProgress.value = "0";
checklistProgress.max = "1";

sbHeaderChecklist.append(sbHelpImageChecklist, checklistCheckmark, sbHeaderChecklistDayCont, resetIcon, sbHeaderDateTimeChecklistCont, sbChecklistStatsCont1, sbChecklistStatsCont2, checklistProgress);
sbHeaderChecklistDayCont.appendChild(sbHeaderChecklistDay);
sbHeaderDateTimeChecklistCont.appendChild(sbHeaderDateTimeChecklist);
sbChecklistStatsCont1.appendChild(sbChecklistStats1);
sbChecklistStatsCont2.appendChild(sbChecklistStats2);

//Build Checklist Overview

// -- Edit Checklist Panel

const daySetup = document.createElement("div");
daySetup.id = "daySetup";
daySetup.classList.add("overviewCont", "round", "disabled");

// ---- Header

const daySetupHeader = document.createElement("div");
daySetupHeader.classList.add("overviewContHeader");

const wrenchImage = document.createElement("IMG");
wrenchImage.classList.add("headerImage", "unselectable");
wrenchImage.src = "\\static\\images\\editIcon.png";

const daySetupHeaderTitle = document.createElement("p");
daySetupHeaderTitle.classList.add("overviewContHeaderTitle", "text", "unselectable");
daySetupHeaderTitle.innerText = "Edit Daily Checklist";

const helpImageSetup = document.createElement("IMG");
helpImageSetup.id = "helpImage";
helpImageSetup.classList.add("unselectable");
helpImageSetup.src = "\\static\\images\\helpIcon.png";

// ---- Footer

const setupFooterCont = document.createElement("div");
setupFooterCont.classList.add("panelFooter");

const saveButton = document.createElement("div");
saveButton.classList.add("footerButton");

const loadButton = document.createElement("div");
loadButton.classList.add("footerButton");

const applyButton = document.createElement("div");
applyButton.classList.add("applyButton", "regularBtnColor");

const saveText = document.createElement("p");
saveText.classList.add("setupButtonText", "text", "unselectable");
saveText.innerText = "Save";

const loadText = document.createElement("p");
loadText.classList.add("setupButtonText", "text", "unselectable");
loadText.innerText = "Load";

const applyText = document.createElement("p");
applyText.classList.add("setupButtonText", "text", "unselectable", "greyedOut");
applyText.innerText = "Apply";

const footerInputField = document.createElement("INPUT");
footerInputField.setAttribute("type", "text");
footerInputField.setAttribute("placeholder", "New Section");
footerInputField.classList.add("footerInput", "disabled");

const submitButton = document.createElement("div");
submitButton.classList.add("submitButton", "disabled");

const submitIcon = document.createElement("IMG");
submitIcon.src = "\\static\\images\\submitIcon.png";
submitIcon.classList.add("inputIconShrinked", "unselectable");

const addButton = document.createElement("div");
addButton.classList.add("addButton");

const addIcon = document.createElement("IMG");
addIcon.src = "\\static\\images\\plusIcon.png";
addIcon.classList.add("inputIconShrinked", "unselectable");

//Edit Task Panel

const taskSetup = document.createElement("div");
taskSetup.id = "weekdaySetup";
taskSetup.classList.add("overviewCont", "round", "disabled");

const taskSetupHeader = document.createElement("div");
taskSetupHeader.classList.add("overviewContHeader");

const pencilImage = document.createElement("IMG");
pencilImage.classList.add("headerImage", "unselectable");
pencilImage.src = "\\static\\images\\pencilIcon.png";

const taskSetupHeaderTitle = document.createElement("p");
taskSetupHeaderTitle.classList.add("overviewContHeaderTitle", "text", "unselectable");
taskSetupHeaderTitle.innerText = "Edit Task";

const helpImageEdit = document.createElement("IMG");
helpImageEdit.id = "helpImage";
helpImageEdit.classList.add("unselectable");
helpImageEdit.src = "\\static\\images\\helpIcon.png";

const taskSetupNameSec = document.createElement("div");
taskSetupNameSec.classList.add("daySetupSection");

const editNameCont = document.createElement("div");
editNameCont.id = "pencilCont";

const editNameIcon = document.createElement("IMG");
editNameIcon.classList.add("pencilNameEditShrinked", "unselectable");
editNameIcon.src = "\\static\\images\\pencilIcon.png";

const editTaskName = document.createElement("p");
editTaskName.id = "editTaskName";
editTaskName.classList.add("text", "unselectable")
editTaskName.innerText = ". . .";

const editTaskNameInput = document.createElement("INPUT");
editTaskNameInput.setAttribute("type", "text");
editTaskNameInput.id = "editTaskNameInput";
editTaskNameInput.classList.add("disabled")

const taskSetupDaysSec = document.createElement("div");
taskSetupDaysSec.classList.add("daySetupSection");

const editFooterCont = document.createElement("div");
editFooterCont.classList.add("panelFooter");

const editApplyButton = document.createElement("div");
editApplyButton.id = "editApplyButton";
editApplyButton.classList.add("regularBtnColor");

const editApplyText = document.createElement("p");
editApplyText.id = "editApplyText";
editApplyText.classList.add("setupButtonText", "text", "unselectable", "greyedOut");
editApplyText.innerText = "Apply";

for (let i = 0; i < 7; i++) {
    let taskSetupCheckbox = document.createElement("INPUT");
    taskSetupCheckbox.classList.add("taskSetupCheckbox");
    taskSetupCheckbox.setAttribute("type", "checkbox");
    taskSetupCheckbox.addEventListener("click", function () {
        if (selectedTask !== null && selectedTask !== undefined)
            editApplyText.classList.remove("greyedOut");
    })

    let taskSetupWeekday = document.createElement("p");
    taskSetupWeekday.classList.add("taskSetupWeekday", "text", "unselectable");
    taskSetupWeekday.innerText = weekdays[i];

    if (i === 6) taskSetupWeekday.style.marginBottom = "0.7cm";

    taskSetupDaysSec.append(taskSetupCheckbox, taskSetupWeekday);
}

/*  Maybe add Freuqncy and Duration Options

const taskSetupFreqSec = document.createElement("div");
taskSetupFreqSec.classList.add("daySetupSection");

const frequencyCont = document.createElement("div");
frequencyCont.classList.add("daySetupFrequency");

const frequencyText = document.createElement("p");
frequencyText.classList.add("daySetupFrequencyText", "unselectable");
frequencyText.innerText = "10";

const frequencyLabel = document.createElement("p");
frequencyLabel.classList.add("taskSetupWeekday", "text", "unselectable");
frequencyLabel.innerText = "Frequency:";

const durationCont = document.createElement("div");
durationCont.classList.add("daySetupFrequency");

const durationText = document.createElement("p");
durationText.classList.add("daySetupFrequencyText", "unselectable");
durationText.innerText = "10";

const frequencyLabel = document.createElement("p");
frequencyLabel.classList.add("taskSetupWeekday", "text", "unselectable");
frequencyLabel.innerText = "Duration:";

*/

bodyCont.append(daySetup, taskSetup);

daySetup.append(daySetupHeader, setupFooterCont);

daySetupHeader.append(wrenchImage, daySetupHeaderTitle, helpImageSetup);
setupFooterCont.append(addButton, saveButton, loadButton, applyButton, footerInputField, submitButton);

addButton.appendChild(addIcon);
saveButton.appendChild(saveText);
loadButton.appendChild(loadText);
applyButton.appendChild(applyText);
submitButton.appendChild(submitIcon);

taskSetup.append(taskSetupHeader, taskSetupNameSec, taskSetupDaysSec, editFooterCont);
taskSetupHeader.append(pencilImage, taskSetupHeaderTitle, helpImageEdit);
taskSetupNameSec.append(editNameCont, editTaskName, editTaskNameInput);
editNameCont.appendChild(editNameIcon);
editFooterCont.appendChild(editApplyButton);
editApplyButton.appendChild(editApplyText);


//Build Stats Overview

const calendarCont = document.createElement("div");
calendarCont.id = "calendarCont";
calendarCont.classList.add("overviewCont", "round", "disabled");

const calendarContHeader = document.createElement("div");
calendarContHeader.classList.add("overviewContHeader");

const calendarIcon = document.createElement("IMG");
calendarIcon.id = "calendarIcon";
calendarIcon.classList.add("unselectable");
calendarIcon.src = "\\static\\images\\calendarIcon.png";

const calendarContHeaderTitle = document.createElement("p");
calendarContHeaderTitle.id = "calendarContHeaderTitle";
calendarContHeaderTitle.classList.add("overviewContHeaderTitle", "text", "unselectable");
calendarContHeaderTitle.innerText = "Checklist Stats";

bodyCont.append(calendarCont);
calendarCont.appendChild(calendarContHeader);
calendarContHeader.append(calendarIcon, calendarContHeaderTitle);

for (let i = 0; i < 7; i++) {
    let weekdayCont = document.createElement("div");
    weekdayCont.classList.add("weekdayCont");
    if (i === 0) {
        weekdayCont.style.marginLeft = "0.5cm";
        weekdayCont.style.borderLeft = "0.5px #202225 solid";
    }
    let weekdayLabel = document.createElement("p");
    weekdayLabel.classList.add("weekdayLabel", "text", "unselectable");
    weekdayLabel.innerText = weekdays[i].slice(0, 3);

    weekdayCont.appendChild(weekdayLabel);
    calendarCont.appendChild(weekdayCont);
}