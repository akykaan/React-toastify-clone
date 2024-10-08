
const buttons = document.querySelectorAll(".btn");
const checkBox = document.getElementById("alertStack");
const label = document.getElementById("label");
label.textContent = "Alert Stack is OFF";

let startTimeId;
let isChecked = false;

checkBox.addEventListener("click", () => {
    label.textContent = `Alert Stack is ${checkBox.checked ? "ON" : "OFF"}`
    isChecked = checkBox.checked
});

const statusConfig = {
    Success: {
        iconClass: "fa-solid fa-check alert-status-success alert-status",
        containerClass: "success-div",
        progressClass: "progress-success"
    },
    Warning: {
        iconClass: "fa-solid fa-circle-xmark alert-status-warning alert-status",
        containerClass: "warning-div",
        progressClass: "progress-warning"
    },
    Danger: {
        iconClass: "fa-solid fa-circle-exclamation alert-status-danger alert-status",
        containerClass: "danger-div",
        progressClass: "progress-danger"
    }
};

buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
        let firstClickTime;
        let remainingTime = 3100;

        const container = createNotification(e.target.dataset.status, e.target.value);
        const progress = container.querySelector(".progress")

        notificationContainerMouseEvents(container, progress, firstClickTime, remainingTime)
        alertStackDiv(container)

        startTime(remainingTime, container, firstClickTime);
    });
});

function createNotification(status, message) {

    const alertNotificationContainer = document.createElement("div");
    alertNotificationContainer.className = "alert-notification-container show-notification";

    if (isChecked) {
        alertNotificationContainer.classList.add(
            "alert-notification-fixed-position"
        );
    }

    const { containerClass, iconClass, progressClass } = statusConfig[status];
    const { container, progress } = createContainer(containerClass, message, iconClass, progressClass, alertNotificationContainer);

    alertNotificationContainer.appendChild(container)
    alertNotificationContainer.appendChild(progress)

    return alertNotificationContainer
}

function createContainer(containerClass, message, iconClass, progressClass, alertNotificationContainer) {
    const container = document.createElement("div");
    container.className = `container ${containerClass}`;

    const statusIcon = document.createElement("i");
    statusIcon.className = iconClass;

    const containerContent = document.createElement("p");
    containerContent.textContent = message;

    const progress = document.createElement("div");
    progress.className = `progress ${progressClass}`;

    const closeIcon = document.createElement("p");
    closeIcon.className = "fa-solid fa-xmark close-icon";
    closeIcon.addEventListener("click", () => {
        closeNotification(alertNotificationContainer);
    });

    container.appendChild(statusIcon);
    container.appendChild(containerContent);
    container.appendChild(closeIcon);

    return { container, progress };
}

function closeNotification(alertNotificationContainer) {
    alertNotificationContainer.classList.add("close-notification");
    alertNotificationContainer.remove();
}

function alertStackDiv(container) {
    const alertContent = document.getElementsByClassName("alert-stack");
    if (alertContent.length !== 0) {
        alertContent[0].appendChild(container);
    } else {
        const alertStack = document.createElement("div");
        alertStack.className = "alert-stack";
        alertStack.appendChild(container);
        document.body.appendChild(alertStack);
    }
}

function notificationContainerMouseEvents(container, progress, firstClickTime, remainingTime) {
    firstClickTime = Date.now();
    container.addEventListener("mouseenter", () => {
        progress.style.animationPlayState = "paused";
        stopTime(startTimeId);
        remainingTime = calculateRemainingTime(firstClickTime, remainingTime)
        console.log(remainingTime);

    });
    container.addEventListener("mouseleave", () => {
        firstClickTime = Date.now();
        progress.style.animationPlayState = "running";
        startTime(remainingTime, container);
    });
}

function calculateRemainingTime(firstClickTime, initialRemainingTime) {
    return initialRemainingTime - (Date.now() - firstClickTime);
}

function startTime(remainingTime, container, firstClickTime) {
    firstClickTime = Date.now();
    startTimeId = setTimeout(() => {
        container.classList.add("exit-notification");
        container.addEventListener("animationend", () => {
            container.remove();
            checkAndRemoveAlertStack();
        });
    }, remainingTime);
}

function stopTime(startTimeId) {
    clearTimeout(startTimeId);
}

function checkAndRemoveAlertStack() {
    const alertStack = document.querySelector(".alert-stack");
    console.log(alertStack);

    if (alertStack && alertStack.children.length === 0) {
        alertStack.remove();
    }
}