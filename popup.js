document.getElementById("save").onclick = function () {
  const website = document.getElementById("website").value.trim();
  const message = document.getElementById("message").value.trim();
  if (!website || !message) {
    document.getElementById("warning").textContent =
      "Please fill in all fields.";
    return;
  }

  // Save new warning
  chrome.storage.local.get({ warnings: {} }, function (data) {
    data.warnings[website] = message;
    chrome.storage.local.set({ warnings: data.warnings }, function () {
      document.getElementById("warning").textContent =
        "Warning saved! Reload the page to see it in action.";
      displayWarnings();
    });
  });
};

function displayWarnings() {
  chrome.storage.local.get("warnings", function (data) {
    const siteList = document.getElementById("siteList");
    siteList.innerHTML = ""; // Clear current list

    // Check if 'warnings' is defined and is an object
    if (data.warnings && typeof data.warnings === "object") {
      Object.keys(data.warnings).forEach(function (website) {
        const div = document.createElement("div");
        div.className = "site-item";
        div.textContent = `${website}: ${data.warnings[website]} `;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function () {
          delete data.warnings[website];
          chrome.storage.local.set(
            { warnings: data.warnings },
            displayWarnings
          );
        };
        div.appendChild(deleteButton);
        siteList.appendChild(div);
      });
    } else {
      // Handle case where no warnings are saved yet
      siteList.textContent = "No websites saved.";
    }
  });
}

// Display warnings when popup loads
document.addEventListener("DOMContentLoaded", displayWarnings);

// This function gets called when the popup is opened
document.addEventListener("DOMContentLoaded", function () {
  getCurrentTabUrl(function (url) {
    const websiteURL = new URL(url).hostname; // Adjust based on whether you're using hostname or full URL
    document.getElementById("website").value = websiteURL;
    // Now fetch and display the message if it exists for this URL
    chrome.storage.local.get({ warnings: {} }, function (data) {
      if (data.warnings && data.warnings[websiteURL]) {
        document.getElementById("message").value = data.warnings[websiteURL];
      }
    });
  });
  displayWarnings(); // To display existing warnings
});

// Function to get the current tab's URL
function getCurrentTabUrl(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    if (tab && tab.url) {
      callback(tab.url);
    }
  });
}
