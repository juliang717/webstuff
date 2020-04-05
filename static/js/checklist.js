//Sidebar -> Body -> Checklist

//const sbBodyChecklist = document.querySelector("#sbBodyChecklist");           -> in setup.js
//const checklistProgress = document.querySelector("#checklistProgress");       -> in setup.js
//const checklistCheckmark = document.querySelector("#checklistCheckmark");     -> in setup.js
//const resetIcon = document.querySelector("#resetIcon");                       -> in setup.js

dailySetupCont = document.querySelector("#daySetup");

let allSections = [];
let todaySections = [];
let maxId = -1;
let selectedTask = null;
let today = null;

//allSections array of sections:
//  section name
//  tasks, array of task objects, task object has name and done variablesF

function updateChecklist() {
    resetChecklist();
    buildChecklist();
}

function buildChecklist() {

    /*Accepts:  Checklist data as object; checklistObj,
                Container to render checklist in; cont,
                Progress bar element to initialize; probBar.

    Imports checklist based on database entries,
    Renders checklist based on checklist object,
    Initializes progress bar based on checklist object.*/

    importChecklistData()
        .then(function () {
            renderSections(sbBodyChecklist);
            initializeProgress();
            setMaxId();
            buildSetup(daySetup);
            adjustFeedHeight();
        })
}

function setMaxId() {
    for (section of allSections) {
        if (section.id > maxId) maxId = section.id;
        for (task of section.tasks) {
            if (task.id > maxId) maxId = task.id;
        }
    }
}

function resetChecklist() {
    /*Removes all elements of the checklist
    Clears the checklist object*/

    const allEles = document.querySelectorAll(".checklistSection");

    for (let ele of allEles) {
        ele.parentElement.removeChild(ele);
    }

    clearDaySetup();
    allSections = [];
}

function importChecklistData() {
    return fetch('/checklist/get')
        .then(res => res.json())
        .then(function (data) {

            allSections = data;
            todaySections = [];

            let counter = 0;

            for (let section of allSections) {
                section["element"] = createSectionElement(section);

                const newSection = {
                    id: section.id,
                    name: section.name,
                    done: section.done,
                    tasks: [],
                    element: section.element,
                }

                todaySections.push(newSection);

                for (let task of section.tasks) {

                    if (task[weekdays[today.weekday].toLowerCase()] === true) {
                        newTask = {
                            id: task.id,
                            name: task.name,
                            done: task.done,
                            section: task.section,
                            element: task.element,
                        }

                        newTask["element"] = createTaskElement(newTask);
                        todaySections[counter].tasks.push(newTask);

                        task["element"] = newTask.element;
                    }
                    else task["element"] = null;
                }

                counter++;
            }

            console.log(todaySections);

            return new Promise((resolve, reject) => {
                resolve();
            });
        })
}

function renderSections(sidebarCont) {

    /*
    Accepts Section Array inpSectionList and Element parentCont, 
    Renders all sections inside parentCont
    */
    for (let section of todaySections) {
        for (let task of section.tasks) {
            section.element.appendChild(task.element);
        }
        if (section.element.childElementCount > 1)
            sidebarCont.appendChild(section.element);
    }
}

function initializeProgress() {
    checklistProgress.value = 0;
    checklistProgress.max = 1;

    for (section of todaySections) {
        for (task of section.tasks) {
            checklistProgress.max++;
            if (task.done === true) completeTask(task, checklistProgress, false);
        }
    }
    checklistProgress.max--;
}

function createTaskElement(task) {

    /*
    Accepts task object; task.

    Returns corresponding task element.
    */

    const newCont = document.createElement("div");
    const newEntry = document.createElement("p");

    newEntry.classList.add("text", "checklistEntry", "unselectable");
    newEntry.innerText = task.name;

    newCont.classList.add("checklistCont");
    newCont.addEventListener("dblclick", function (e) {
        if (!newEntry.classList.contains("completed")) {
            completeTask(task, checklistProgress);
        }
    });

    newCont.appendChild(newEntry);

    return newCont;
}

function createSectionElement(section) {

    /*
    Accepts section object; inpTask, 
    Returns corresponding section element
    */

    const newSectionEle = document.createElement("div");
    const newSectionEleTitle = document.createElement("p");
    newSectionEle.classList.add("checklistSection");
    newSectionEleTitle.classList.add("checklistSectionTitle", "text", "unselectable");
    newSectionEleTitle.innerText = section.name;

    newSectionEle.appendChild(newSectionEleTitle);

    return newSectionEle;
}

function completeTask(inpTask, progBar, notifyDB = true) {
    inpTask.element.firstChild.classList.add("completed");
    inpTask.done = true;
    progBar.value++;
    if (notifyDB) {
        fetch("/checklist/complete_task", {
            method: "post",
            credentials: "same-origin",
            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: inpTask.id }),
            credentials: 'include'
        })
    }

    completeSection(inpTask);
}

function completeSection(inpEntry, notifyDB = true) {
    for (let section of todaySections) {
        let complete = false;
        if ((section.name === inpEntry.section)) {
            if (section.done === false) {
                complete = true;
                for (task of section["tasks"]) {
                    if (task.done !== true) {
                        complete = false;
                    }
                }
            }
            else if (section.done === true) {
                complete = true;
            }
        }
        if (complete === true) {
            section.element.firstChild.classList.add("completed");
            section.done = true;

            completeList(todaySections);
        }
    }
}

function completeList(inpSectionList) {
    let complete = true;
    for (let section of inpSectionList) {
        if (section.done !== true) {
            complete = false;
        }
    }
    if (complete === true) {
        checklistCheckmark.classList.remove("hidden");
    }
}

function undoChecklist() {
    for (section of todaySections) {
        section.done = false;
        for (task of section.tasks) {
            task.done = false;
            task.element.firstChild.classList.remove("completed");

        }
        section.element.firstChild.classList.remove("completed");
    }

    checklistCheckmark.classList.add("hidden");

    fetch('/checklist/undo');

    initializeProgress();

}

function addSbChecklistEvents() {
    resetIcon.addEventListener("click", undoChecklist);
}

/*-----------Body-----------*/



/*-----------Body -> Checklist-----------*/



/*-----------Body -> Checklist -> Daily Setup-----------*/

function applySetup() {
    if (!this.firstChild.classList.contains("greyedOut")) {
        updateChecklistDB()
            .then(updateChecklist);
        this.firstChild.classList.add("greyedOut");
        this.classList.remove("highlighted");
        this.classList.add("regularBtnColor");
    }
}

function updateChecklistDB() {

    sectionsObj = []

    for (let section of allSections) {

        newSection = {
            name: section.name,
            done: section.done,
            tasks: [],
        }

        for (let task of section.tasks) {
            newTask = {
                name: task.name,
                done: task.done,
                section: task.section,

                monday: task.monday,
                tuesday: task.tuesday,
                wednesday: task.wednesday,
                thursday: task.thursday,
                friday: task.friday,
                saturday: task.saturday,
                sunday: task.sunday,
            }

            newSection.tasks.push(newTask);
        }

        sectionsObj.push(newSection);
    }

    return fetch("/checklist/update", {
        method: "post",
        credentials: "same-origin",
        headers: {
            "X-CSRFToken": getCookie("csrftoken"),
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sectionsObj),
        credentials: 'include'
    })
}

function getEleIndex(arr, eleOffsetTop) {

    for (let i = 0; i < arr.length; i++) {
        if (arr[i]["daySetupEle"].offsetTop === eleOffsetTop) return i;
    }
    return -1;
}

function getObjFromEle(ele, objType) {

    /*  Obj Types:
        "section"
        "task"
    */

    if (objType === "section") {
        return allSections[getEleIndex(allSections, ele.offsetTop)];
    }
    else if (objType === "task") {
        let sectionIndex = getEleIndex(allSections, ele.parentElement.offsetTop);
        let taskIndex = getEleIndex(allSections[sectionIndex].tasks, ele.offsetTop);
        return allSections[sectionIndex].tasks[taskIndex];
    }
}

function swapSectionUp() {
    let index = getEleIndex(allSections, this.parentElement.parentElement.offsetTop);

    if (index > 0) {
        let tempId = allSections[index - 1].id;
        allSections[index - 1].id = allSections[index].id;
        allSections[index].id = tempId;

        let temp = allSections[index - 1];
        allSections[index - 1] = allSections[index];
        allSections[index] = temp;

        applyText.classList.remove("greyedOut");

        clearDaySetup();
        resetEditTask();
        buildSetup(dailySetupCont);
    }
}

function swapSectionDown() {

    let index = getEleIndex(allSections, this.parentElement.parentElement.offsetTop);

    if (index != -1 && index < allSections.length - 1) {

        let tempId = allSections[index + 1].id;
        allSections[index + 1].id = allSections[index].id;
        allSections[index].id = tempId;

        let temp = allSections[index + 1];
        allSections[index + 1] = allSections[index];
        allSections[index] = temp;

        applyText.classList.remove("greyedOut");

        clearDaySetup();
        resetEditTask();
        buildSetup(dailySetupCont);
    }
}

function swapTaskUp() {
    let sectionIndex = getEleIndex(allSections, this.parentElement.parentElement.offsetTop);
    let taskIndex = getEleIndex(allSections[sectionIndex].tasks, this.parentElement.offsetTop);
    const currTasks = allSections[sectionIndex].tasks;

    if (taskIndex > 0) {
        const input1 = currTasks[taskIndex].daySetupEle.querySelector(".taskInput");
        const input2 = currTasks[taskIndex - 1].daySetupEle.querySelector(".taskInput");

        if (input1 !== null && input1.classList.contains("hidden") == false) {
            currTasks[taskIndex].daySetupEle.querySelector(".daySetupEntryText").innerText = input1.value;
            currTasks[taskIndex].name = input1.value;
        }
        if (input2 !== null && input2.classList.contains("hidden") == false) {
            currTasks[taskIndex - 1].daySetupEle.querySelector(".daySetupEntryText").innerText = input2.value;
            currTasks[taskIndex - 1].name = input2.value;
        }

        let tempId = currTasks[taskIndex - 1].id;
        currTasks[taskIndex - 1].id = currTasks[taskIndex].id;
        currTasks[taskIndex].id = tempId;

        let temp = currTasks[taskIndex - 1];
        currTasks[taskIndex - 1] = currTasks[taskIndex];
        currTasks[taskIndex] = temp;

        applyText.classList.remove("greyedOut");

        clearDaySetup();
        resetEditTask();
        buildSetup(dailySetupCont);
    }
}

function swapTaskDown() {
    let sectionIndex = getEleIndex(allSections, this.parentElement.parentElement.offsetTop);
    let taskIndex = getEleIndex(allSections[sectionIndex].tasks, this.parentElement.offsetTop);
    const currTasks = allSections[sectionIndex].tasks;

    if (taskIndex != -1 && taskIndex < currTasks.length - 1) {
        let tempId = currTasks[taskIndex + 1].id;
        currTasks[taskIndex + 1].id = currTasks[taskIndex].id;
        currTasks[taskIndex].id = tempId;

        let temp = currTasks[taskIndex + 1];
        currTasks[taskIndex + 1] = currTasks[taskIndex];
        currTasks[taskIndex] = temp;

        applyText.classList.remove("greyedOut");

        clearDaySetup();
        resetEditTask();
        buildSetup(dailySetupCont);
    }
}

function clearDaySetup() {
    for (section of allSections) {
        dailySetupCont.removeChild(section.daySetupEle);
    }
}

function buildSetup(cont) {
    for (let section of allSections) {
        let ele = buildSetupSection(section.name, section)
        section["daySetupEle"] = ele;
        cont.insertBefore(ele, setupFooterCont);
    }
}

function buildSetupSection(title, section) {

    function addEntry() {

        function submitEntry(e, ele = null) {

            let thisEle = null;

            if (ele === null) thisEle = this;
            else thisEle = ele;

            const taskObj = getObjFromEle(thisEle.parentElement, "task");

            taskObj.name = thisEle.parentElement.querySelector(".taskInput").value;

            thisEle.parentElement.querySelector(".daySetupEntryText").innerText = inputField.value;

            inputField.classList.add("disabled");
            submitButton.classList.add("disabled");
            entryText.classList.remove("disabled");
        }

        function keySubmit(e) {
            if (e.key === "Enter") {
                submitEntry(e, this);
            }
        }

        const sectionEle = this.parentElement.parentElement;
        const sectionObj = getObjFromEle(sectionEle, "section");

        const newEntry = buildSetupEntry("", 1, false);

        const inputField = document.createElement("INPUT");
        inputField.setAttribute("type", "text");
        inputField.setAttribute("placeholder", "New Task");
        inputField.classList.add("taskInput");
        inputField.addEventListener("keypress", keySubmit);

        const entryText = newEntry.querySelector(".daySetupEntryText");
        entryText.classList.add("disabled");

        const submitButton = document.createElement("div");
        submitButton.classList.add("taskSubmitCont");
        submitButton.addEventListener("mouseover", function () {
            this.firstChild.classList.remove("taskSubmitIconShrinked");
            this.firstChild.classList.add("taskSubmitIconEnlarged");
        })
        submitButton.addEventListener("mouseout", function () {
            this.firstChild.classList.remove("taskSubmitIconEnlarged");
            this.firstChild.classList.add("taskSubmitIconShrinked");
        })
        submitButton.addEventListener("click", submitEntry)

        const submitIcon = document.createElement("IMG");
        submitIcon.classList.add("taskSubmitIconShrinked");
        submitIcon.src = "\\static\\images\\submitIcon.png";

        newEntry.appendChild(inputField);
        newEntry.appendChild(submitButton);
        submitButton.appendChild(submitIcon);

        this.parentElement.parentElement.appendChild(newEntry);

        const newTask = {
            id: ++maxId,
            name: inputField.value,
            done: false,
            section: sectionObj.name,
            frequency: 1,
            daySetupEle: newEntry,
        }

        sectionObj.tasks.push(newTask);

        applyText.classList.remove("greyedOut");

        inputField.focus();
    }

    function removeSection() {
        const sectionEle = this.parentElement.parentElement;
        const sectionObj = getObjFromEle(sectionEle, "section");

        for (task of sectionObj.tasks) {
            task.daySetupEle.parentElement.removeChild(task.daySetupEle);
        }

        allSections.splice(getEleIndex(allSections, sectionEle.offsetTop), 1);

        sectionEle.parentElement.removeChild(sectionEle);

        applyText.classList.remove("greyedOut");

        if (selectedTask !== null && selectedTask.parentElement === null) resetEditTask();

    }

    function hoverArrow() {
        this.firstChild.classList.remove("shrinkedArrow");
        this.firstChild.classList.add("enlargedArrow");
    }

    function unhoverArrow() {
        this.firstChild.classList.remove("enlargedArrow");
        this.firstChild.classList.add("shrinkedArrow");
    }

    const sectionCont = document.createElement("div");
    sectionCont.classList.add("daySetupSection");

    const addIcon = document.createElement("IMG");
    addIcon.src = "\\static\\images\\plusIcon.png";
    addIcon.classList.add("sectionAddIcon", "shrinkedAdd", "hidden");
    addIcon.addEventListener("click", addEntry);
    addIcon.addEventListener("mouseover", function () {
        this.classList.remove("shrinkedAdd");
        this.classList.add("enlargedAdd");
    });
    addIcon.addEventListener("mouseout", function () {
        this.classList.remove("enlargedAdd");
        this.classList.add("shrinkedAdd");
    });

    const sectionTitleCont = document.createElement("div");
    sectionTitleCont.classList.add("daySetupSectionTitleCont");

    const sectionTitle = document.createElement("p");
    sectionTitle.classList.add("daySetupSectionTitle", "text", "unselectable");
    sectionTitle.innerText = title;

    const removeIcon = document.createElement("IMG");
    removeIcon.src = "\\static\\images\\removeIcon.png";
    removeIcon.classList.add("removeIcon", "shrinkedRemove", "unselectable", "hidden");

    const arrowDown = document.createElement("IMG");
    arrowDown.src = "\\static\\images\\arrowDownIcon.png";
    arrowDown.classList.add("arrowIcon", "shrinkedArrow", "unselectable", "hidden");

    const removeIconCont = document.createElement("div");
    removeIconCont.classList.add("iconWrapper");
    removeIconCont.addEventListener("click", removeSection);
    removeIconCont.addEventListener("mouseover", function () {
        this.firstChild.classList.remove("shrinkedRemove");
        this.firstChild.classList.add("enlargedRemove");
    });
    removeIconCont.addEventListener("mouseout", function () {
        this.firstChild.classList.remove("enlargedRemove");
        this.firstChild.classList.add("shrinkedRemove");
    });

    const arrowDownCont = document.createElement("div");
    arrowDownCont.classList.add("iconWrapper");
    arrowDownCont.addEventListener("mouseover", hoverArrow);
    arrowDownCont.addEventListener("mouseout", unhoverArrow);
    arrowDownCont.addEventListener("click", swapSectionDown);

    const arrowUpCont = document.createElement("div");
    arrowUpCont.classList.add("iconWrapper");
    arrowUpCont.addEventListener("mouseover", hoverArrow);
    arrowUpCont.addEventListener("mouseout", unhoverArrow);
    arrowUpCont.addEventListener("click", swapSectionUp);

    const arrowUp = document.createElement("IMG");
    arrowUp.src = "\\static\\images\\arrowUpIcon.png";
    arrowUp.classList.add("arrowIcon", "shrinkedArrow", "unselectable", "hidden");

    sectionTitleCont.addEventListener("mouseover", function () {
        this.classList.add("highlighted");
        this.parentElement.classList.add("highlighted");
        entries = this.parentElement.querySelectorAll(".daySetupEntry");
        for (let ele of entries) {
            ele.classList.add("highlighted");
        }
        addIcon.classList.remove("hidden");
        removeIcon.classList.remove("hidden");
        arrowDown.classList.remove("hidden");
        arrowUp.classList.remove("hidden");
    })
    sectionTitleCont.addEventListener("mouseout", function () {
        this.classList.remove("highlighted");
        this.parentElement.classList.remove("highlighted");
        entries = this.parentElement.querySelectorAll(".daySetupEntry");
        for (let ele of entries) {
            ele.classList.remove("highlighted");
        }

        addIcon.classList.add("hidden");
        removeIcon.classList.add("hidden");
        arrowDown.classList.add("hidden");
        arrowUp.classList.add("hidden");
    })

    sectionCont.appendChild(sectionTitleCont);
    sectionTitleCont.append(
        addIcon,
        sectionTitle,
        arrowDown,
        removeIconCont,
        arrowDownCont,
        arrowUpCont);
    removeIconCont.appendChild(removeIcon);
    arrowDownCont.appendChild(arrowDown);
    arrowUpCont.appendChild(arrowUp);

    for (let task of section.tasks) {
        let edited = !(
            task.monday &&
            task.tuesday &&
            task.wednesday &&
            task.thursday &&
            task.friday &&
            task.saturday &&
            task.sunday);

        let ele = buildSetupEntry(task.name, task.frequency, edited);
        sectionCont.appendChild(ele);
        task["daySetupEle"] = ele;
    }

    return sectionCont;
}

function buildSetupEntry(name, frequency, edited) {

    function removeEntry() {

        const taskEle = this.parentElement;
        const sectionEle = taskEle.parentElement;
        const sectionObj = getObjFromEle(sectionEle, "section");

        sectionObj.tasks.splice(getEleIndex(sectionObj.tasks, taskEle.offsetTop), 1);

        sectionEle.removeChild(taskEle);

        applyText.classList.remove("greyedOut");

        if (selectedTask !== null && selectedTask.parentElement === null) resetEditTask();

    }

    function highlightOn() {
        if (selectedTask !== this) {
            this.classList.add("highlighted");

            removeIcon.classList.remove("hidden");
            arrowDown.classList.remove("hidden");
            arrowUp.classList.remove("hidden");
        }
    }

    function highlightOff() {
        if (selectedTask !== this) {
            this.classList.remove("highlighted");

            removeIcon.classList.add("hidden");
            arrowDown.classList.add("hidden");
            arrowUp.classList.add("hidden");
        }
    }

    function enlargeArrow() {
        this.firstChild.classList.remove("shrinkedArrow");
        this.firstChild.classList.add("enlargedArrow");
    }

    function shrinkArrow() {
        this.firstChild.classList.remove("enlargedArrow");
        this.firstChild.classList.add("shrinkedArrow");
    }

    const entry = document.createElement("div");
    entry.classList.add("daySetupEntry");

    const editedIcon = document.createElement("IMG");
    editedIcon.src = "\\static\\images\\pencilIcon.png";
    editedIcon.classList.add("editedIcon", "unselectable");
    if (!edited) editedIcon.classList.add("hidden");

    const entryText = document.createElement("p");
    entryText.classList.add("daySetupEntryText", "text", "unselectable");
    entryText.innerText = name;

    const removeIcon = document.createElement("IMG");
    removeIcon.src = "\\static\\images\\removeIcon.png";
    removeIcon.classList.add("removeIcon", "shrinkedRemove", "entryRemoveShift", "unselectable", "hidden");

    const arrowDown = document.createElement("IMG");
    arrowDown.src = "\\static\\images\\arrowDownIcon.png";
    arrowDown.classList.add("arrowIcon", "shrinkedArrow", "entryArrowShift", "unselectable", "hidden");

    const arrowUp = document.createElement("IMG");
    arrowUp.src = "\\static\\images\\arrowUpIcon.png";
    arrowUp.classList.add("arrowIcon", "shrinkedArrow", "entryArrowShift", "unselectable", "hidden");

    const removeIconCont = document.createElement("div");
    removeIconCont.classList.add("iconWrapper");
    removeIconCont.addEventListener("click", removeEntry);
    removeIconCont.addEventListener("mouseover", function () {
        this.firstChild.classList.remove("shrinkedRemove");
        this.firstChild.classList.add("enlargedRemove");
    });
    removeIconCont.addEventListener("mouseout", function () {
        this.firstChild.classList.remove("enlargedRemove");
        this.firstChild.classList.add("shrinkedRemove");
    });

    const arrowDownCont = document.createElement("div");
    arrowDownCont.classList.add("iconWrapper");
    arrowDownCont.addEventListener("mouseover", enlargeArrow);
    arrowDownCont.addEventListener("mouseout", shrinkArrow);
    arrowDownCont.addEventListener("click", swapTaskDown);

    const arrowUpCont = document.createElement("div");
    arrowUpCont.classList.add("iconWrapper");
    arrowUpCont.addEventListener("mouseover", enlargeArrow);
    arrowUpCont.addEventListener("mouseout", shrinkArrow);
    arrowUpCont.addEventListener("click", swapTaskUp);

    entry.addEventListener("mouseover", highlightOn);
    entry.addEventListener("mouseout", highlightOff);
    entry.addEventListener("click", toggleSelect)

    entry.append(editedIcon, entryText, removeIconCont, arrowDownCont, arrowUpCont);

    removeIconCont.appendChild(removeIcon);
    arrowDownCont.appendChild(arrowDown);
    arrowUpCont.appendChild(arrowUp);

    return entry;
}

function toggleSelect(e, inpEle = null) {


    let ele = null;

    if (inpEle === null) ele = this;
    else ele = inpEle;

    if (ele.parentElement !== null &&
        ele.parentElement.offsetTop !== 0 &&
        (ele.querySelector(".taskInput") === null ||
            ele.querySelector(".taskInput").classList.contains("disabled"))) {

        const icons = ele.querySelectorAll(".iconWrapper");
        const checkboxList = taskSetupDaysSec.querySelectorAll(".taskSetupCheckbox");
        const task = getObjFromEle(ele, "task");

        if (selectedTask !== null) {
            selectedTask.classList.remove("pressed");

            for (icon of selectedTask.querySelectorAll(".iconWrapper")) {
                icon.firstChild.classList.add("hidden");
            }
        }

        if (selectedTask !== ele) {
            selectedTask = ele;

            ele.classList.remove("highlighted");
            ele.classList.add("pressed");

            for (icon of icons) {
                icon.firstChild.classList.remove("hidden");
            }

            for (let i = 0; i < 7; i++) {
                checkboxList[i].checked = task[weekdays[i].toLowerCase()];
            }

            editTaskName.innerText = task.name;

        }
        else if (selectedTask === ele) {
            selectedTask = null;

            ele.classList.add("highlighted");

            resetEditTask();
        }
    }
}

function resetEditTask() {
    const checkboxList = taskSetupDaysSec.querySelectorAll(".taskSetupCheckbox");

    selectedTask = null;

    editTaskName.innerText = ". . .";

    for (let i = 0; i < 7; i++) {
        checkboxList[i].checked = false;
    }
}

function addSetupFooterEvents() {

    function enlarge() {
        this.firstChild.classList.remove("inputIconShrinked");
        this.firstChild.classList.add("inputIconEnlarged");
    }

    function shrink() {
        this.firstChild.classList.remove("inputIconEnlarged");
        this.firstChild.classList.add("inputIconShrinked");
    }

    function submit() {
        const newSection = {
            id: ++maxId,
            name: footerInputField.value,
            done: false,
            tasks: [],
        }
        let ele = buildSetupSection(footerInputField.value, newSection)
        newSection["daySetupEle"] = ele;
        dailySetupCont.insertBefore(ele, setupFooterCont);
        allSections.push(newSection);

        saveButton.classList.toggle("disabled");
        loadButton.classList.toggle("disabled");
        applyButton.classList.toggle("disabled");
        submitButton.classList.toggle("disabled");
        footerInputField.classList.toggle("disabled");

        applyText.classList.remove("greyedOut");
    }

    function keySubmit(e) {
        if (e.key === "Enter") {
            submit();
        }
    }

    applyButton.addEventListener("click", applySetup);
    applyButton.addEventListener("mouseover", function () {
        if (!this.firstChild.classList.contains("greyedOut")) {
            this.classList.remove("regularBtnColor");
            this.classList.add("highlighted");
        }
    })
    applyButton.addEventListener("mouseout", function () {
        this.classList.remove("highlighted");
        this.classList.add("regularBtnColor");
    })

    submitButton.addEventListener("mouseover", enlarge);
    submitButton.addEventListener("mouseout", shrink);
    submitButton.addEventListener("click", submit);

    addButton.addEventListener("mouseover", enlarge);
    addButton.addEventListener("mouseout", shrink);
    addButton.addEventListener("click", function () {
        saveButton.classList.toggle("disabled");
        loadButton.classList.toggle("disabled");
        applyButton.classList.toggle("disabled");
        submitButton.classList.toggle("disabled");
        footerInputField.classList.toggle("disabled");
        footerInputField.value = "";
        footerInputField.focus();
    })

    footerInputField.addEventListener("keypress", keySubmit);
}

function addEditTaskEvents() {

    function enterEditMode() {
        editNameIcon.setAttribute("src", "\\static\\images\\submitIcon.png");
        editTaskName.classList.add("disabled");
        editTaskNameInput.classList.remove("disabled");

        editTaskNameInput.value = editTaskName.innerText;

        editTaskNameInput.focus();
    }

    function exitEditMode() {
        editNameIcon.setAttribute("src", "\\static\\images\\pencilIcon.png")
        editTaskNameInput.classList.add("disabled");
        editTaskName.classList.remove("disabled");

        editTaskName.innerText = editTaskNameInput.value;

        editApplyButton.firstChild.classList.remove("greyedOut");
    }

    function switchEditMode() {
        if (selectedTask !== null) {
            if (editNameIcon.src === "http://31.220.62.90:8000/static/images/pencilIcon.png") {
                enterEditMode();
            }
            else {
                exitEditMode();
            }
        }
    }

    function applyChanges() {
        if (!editApplyText.classList.contains("greyedOut") && selectedTask !== null) {

            let edited = false;

            const taskEditedIcon = selectedTask.querySelector(".editedIcon");
            const checkboxList = taskSetupDaysSec.querySelectorAll(".taskSetupCheckbox");
            const taskObj = getObjFromEle(selectedTask, "task");

            taskObj.name = editTaskName.innerText;
            selectedTask.querySelector(".text").innerText = editTaskName.innerText;

            for (let i = 0; i < 7; i++) {
                taskObj[weekdays[i].toLowerCase()] = checkboxList[i].checked;
            }

            if (taskObj.name !== editTaskName.innerText) {
                taskObj.name = editTaskName.innerText;
            }

            for (checkbox of checkboxList) {
                if (!checkbox.checked) {
                    edited = true;
                    break;
                }
            }

            if (edited) taskEditedIcon.classList.remove("hidden");
            else taskEditedIcon.classList.add("hidden");

            this.firstChild.classList.add("greyedOut");
            this.classList.remove("highlighted");
            this.classList.add("regularBtnColor");

            applyText.classList.remove("greyedOut");
        }
    }

    editNameCont.addEventListener("mouseover", function () {
        this.firstChild.classList.remove("pencilNameEditShrinked");
        this.firstChild.classList.add("pencilNameEditEnlarged");
    });
    editNameCont.addEventListener("mouseout", function () {
        this.firstChild.classList.remove("pencilNameEditEnlarged");
        this.firstChild.classList.add("pencilNameEditShrinked");
    });

    editNameCont.addEventListener("click", switchEditMode);

    editApplyButton.addEventListener("click", applyChanges);
    editApplyButton.addEventListener("mouseover", function () {
        if (!this.firstChild.classList.contains("greyedOut")) {
            this.classList.remove("regularBtnColor");
            this.classList.add("highlighted");
        }
    });
    editApplyButton.addEventListener("mouseout", function () {
        this.classList.remove("highlighted");
        this.classList.add("regularBtnColor");
    });

    editTaskNameInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") exitEditMode();
    });

}

fetch("date_time/get_curr")
    .then(res => res.json())
    .then(function (data) {
        today = data;
        return new Promise((resolve, reject) => { resolve(); })
    })
    .then(function () {
        buildChecklist();
        addSbChecklistEvents();
        addSetupFooterEvents();
        addEditTaskEvents();
        console.log(today);
    })



//Date Testing

//fetch("/date_time/get_curr");


/*

const obje = {
    name: "Have Existential Crisis",
    done: "False",
}

const responseObj = fetch("/checklist/update", {
    method: "post",
    credentials: "same-origin",
    headers: {
        "X-CSRFToken": getCookie("csrftoken"),
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
    body: JSON.stringify(obje),
})
    .then(res => res.text())
    .then(function (text) {
        console.log(text);
    });

*/

