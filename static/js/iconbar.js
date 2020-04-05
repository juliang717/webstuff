let activeTab = "checklist"

const elements = {
    logo: {
        sidebar: [],
        overview: [],
    },
    dashboard: {
        sidebar: [],
        overview: [],
    },
    checklist: {
        sidebar: [sbHeaderChecklist, sbBodyChecklist],
        overview: [daySetup, taskSetup],
    },
    goals: {
        sidebar: [],
        overview: [],
    },
    nutrition: {
        sidebar: [],
        overview: [],
    },
    fitness: {
        sidebar: [],
        overview: [],
    },
    stats: {
        sidebar: [],
        overview: [calendarCont],
    },
    settings: {
        sidebar: [],
        overview: [],
    },
}

const iconConts = document.querySelectorAll(".iconCont");

function iconHoverOn() {
    this.classList.add("highlighted");
}
function iconHoverOff() {
    this.classList.remove("highlighted");
}
function iconPressed() {
    this.classList.toggle("pressedIcon");

    if (activeTab !== "") {
        document.querySelector("#" + activeTab + "IconCont").classList.toggle("pressedIcon");
    }

    switchTab(this.name);
}

for (let cont of iconConts) {
    cont.addEventListener("mouseover", iconHoverOn);
    cont.addEventListener("mouseout", iconHoverOff);
    cont.addEventListener("click", iconPressed);
    cont.name = cont.id.replace("IconCont", "");
}

settingsCont = document.querySelector("#settingsIconCont");
settingsCont.addEventListener("mouseover", iconHoverOn);
settingsCont.addEventListener("mouseout", iconHoverOff);
settingsCont.addEventListener("click", iconPressed);
settingsCont.name = "settings";

document.querySelector("#" + activeTab + "IconCont").classList.toggle("pressedIcon");

function switchTab(tab) {
    for (let ele of elements[activeTab].sidebar) {
        ele.classList.add("disabled");
    }
    for (let ele of elements[activeTab].overview) {
        ele.classList.add("disabled");
    }

    for (let ele of elements[tab].sidebar) {
        ele.classList.remove("disabled");
    }
    for (let ele of elements[tab].overview) {
        ele.classList.remove("disabled");
    }

    activeTab = tab;
}

switchTab(activeTab);