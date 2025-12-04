const investorForm = document.getElementById("investorForm");

// submitting function
investorForm.addEventListener("submit", async (e) => {
  e.preventDefault(); //not reload
  const investorFullName = document.getElementById("investorName");
  const investorEmail = document.getElementById("investorEmail");
  const investorOrganizationName = document.getElementById("organizationName");
  const investorOrganizationUrl = document.getElementById("organizationUrl");
  // getting checkboxes vlues into array
  const industryCheckboxes = Array.from(
    document.querySelectorAll('input[name="industry"]:checked')
  ).map((checkbox) => checkbox.value);
  const stageCheckboxes = Array.from(
    document.querySelectorAll('input[name="stage"]:checked')
  ).map((checkbox) => checkbox.value);

  // forming data to db
  const formInvestorData = {
    // contactName,contactEmail => have to be exactly like in db
    contactName: investorFullName.value,
    contactEmail: investorEmail.value,
    name: investorOrganizationName.value,
    website: investorOrganizationUrl.value,
    industries: industryCheckboxes,
    stages: stageCheckboxes,
    photoUrl: null,
    investorType: null,
  };

  // post new data = formInvestorData to db
  try {
    const response = await fetch("http://localhost:3000/organizations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formInvestorData),
    });
    const data = await response.json();
    const regNewInvestor = data.receivedData.id;

    // otpravka id investora dlya recomendations
    window.location.href = `./scannedResults.html?id=${regNewInvestor}`;
    investorForm.reset();
  } catch (error) {
    //handle error
    console.error("Error:", error);
  }
});
