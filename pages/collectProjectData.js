const projectForm = document.getElementById("projectForm");

projectForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const projectName = document.getElementById("projectName");
  const projectUrl = document.getElementById("projectUrl");
  const projectEmail = document.getElementById("projectEmail");
  const projectDescription = document.getElementById("projectDescription");
  const projectContactName = document.getElementById("projectContactName");
  const industryCheckboxes = Array.from(
    document.querySelectorAll('input[name="industry"]:checked')
  ).map((checkbox) => checkbox.value);
  const stageCheckboxes = Array.from(
    document.querySelectorAll('input[name="stage"]:checked')
  ).map((checkbox) => checkbox.value);

  const formProjectData = {
    contactName: projectContactName.value,
    contactEmail: projectEmail.value,
    name: projectName.value,
    website: projectUrl.value,
    industries: industryCheckboxes,
    stages: stageCheckboxes,
    photoUrl: null,
    description: projectDescription.value,
  };

  try {
    const response = await fetch("http://localhost:3000/startups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formProjectData),
    });
    const data = await response.json();
    const projectName = data.receivedData.name;
    // notification about success
    showNotification(`Saved successfully! ${projectName} `, "success");
    // obnovleniye form
    projectForm.reset();
  } catch (error) {
    // notification about error
    showNotification(`Error: ${error}`, "error");
    console.error("Error:", error);
  }
});

function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);
  if (type === "success") {
    notification.style.backgroundColor = "#10b981";
  } else {
    notification.style.backgroundColor = "#ef4444";
  }
  // Remove after 3 seconds
  setTimeout(() => {
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
