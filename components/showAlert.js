// alert.js
function showAlert(message, type = "success", duration = 3000) {
    let alertContainer = document.getElementById("alert-container");


    // If the alert container doesn't exist, create it dynamically
    if (!alertContainer) {
        alertContainer = document.createElement("div");
        alertContainer.id = "alert-container";
        alertContainer.className = "alert custom-alert";
        document.body.appendChild(alertContainer);
    }

    alertContainer.className = `alert alert-${type} custom-alert`; // Set alert type
    alertContainer.textContent = message; // Set the message
    alertContainer.style.display = "block"; // Show the alert

    // Hide the alert after the specified duration
    setTimeout(() => {
        alertContainer.style.display = "none";
    }, duration);
}
