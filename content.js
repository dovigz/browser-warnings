chrome.storage.local.get("warnings", function (data) {
  const currentWebsite = window.location.hostname;
  const warnings = data.warnings || {}; // Ensure warnings is an object
  if (warnings[currentWebsite]) {
    // Create the warning banner
    const warningBar = document.createElement("div");
    warningBar.style.cssText =
      "position: fixed; top: 0; left: 0; width: 100%; background-color: red; color: white; text-align: center; z-index: 9999999999999999999999999999999999999999999999999; padding: 10px 0;";

    // Create the close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.style.cssText =
      "position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background-color: white; color: black; border: none; cursor: pointer;";

    // Append the close button to the warning bar
    warningBar.appendChild(closeButton);

    // Set the warning message
    const message = document.createTextNode(warnings[currentWebsite]);
    warningBar.appendChild(message);

    // Append the warning bar to the body
    document.body.appendChild(warningBar);

    // Add click event listener to the close button
    closeButton.addEventListener("click", function () {
      warningBar.remove();
    });
  }
});
