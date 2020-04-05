const lock = document.querySelector("#sidebarLockImage");
let locked = false;

lock.addEventListener("click", function () {
    if (locked) {
        this.src = "\\static\\images\\lockOpen.png";
        locked = false;
        this.parentElement.style.backgroundColor = "#393C43";
    }
    else {
        this.src = "\\static\\images\\lockClosed.png";
        locked = true;
        this.parentElement.style.backgroundColor = "#202225";
    }
});

lock.parentElement.parentElement.addEventListener("mouseover", function () {
    if (!locked) {
        lock.parentElement.style.backgroundColor = "#393C43";
    }
})

lock.parentElement.parentElement.addEventListener("mouseout", function () {
    if (!locked) {
        lock.parentElement.style.backgroundColor = "#2F3136";
    }
})