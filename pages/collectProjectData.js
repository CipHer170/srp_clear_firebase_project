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
    console.log("Luck");
    console.log("Data", data);
    console.log("Formdata", formProjectData);
    projectForm.reset();
    console.log("Formdata", formProjectData);
  } catch (error) {
    console.error("Error:", error);
  }
});
