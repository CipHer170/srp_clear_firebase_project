const investorForm = document.getElementById("investorForm");

investorForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const investorFullName = document.getElementById("investorName");
  const investorEmail = document.getElementById("investorEmail");
  const investorOrganizationName = document.getElementById("organizationName");
  const investorOrganizationUrl = document.getElementById("organizationUrl");
  const industryCheckboxes = Array.from(
    document.querySelectorAll('input[name="industry"]:checked')
  ).map((checkbox) => checkbox.value);

  const stageCheckboxes = Array.from(
    document.querySelectorAll('input[name="stage"]:checked')
  ).map((checkbox) => checkbox.value);

  const formInvestorData = {
    // contactName,contactEmail => kak v db doljno bit
    contactName: investorFullName.value,
    contactEmail: investorEmail.value,
    name: investorOrganizationName.value,
    website: investorOrganizationUrl.value,
    industries: industryCheckboxes,
    stages: stageCheckboxes,
    photoUrl: null,
  };

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

    window.location.href = `./scannedResults.html?id=${regNewInvestor}`;

    investorForm.reset();
  } catch (error) {
    console.error("Error:", error);
  }
});
