const allIndustries = document.getElementById("allIndustries");

getIndustries();
// industries from db
async function getIndustries() {
  try {
    const response = await fetch("http://localhost:3000/industries");
    const { industries } = await response.json();
    console.log(industries);

    industries.forEach(({ id, industry }) => {
      const industryCheckbox = document.createElement("input");
      (industryCheckbox.type = "checkbox"),
        (industryCheckbox.id = id),
        (industryCheckbox.name = "industry"),
        (industryCheckbox.value = id);

      const industryLabel = document.createElement("label");
      (industryLabel.textContent = industry),
        (industryLabel.htmlFor = id),
        (industryLabel.className = "no-select");
      const choose = document.createElement("div");
      choose.appendChild(industryCheckbox);
      choose.appendChild(industryLabel);
      allIndustries.appendChild(choose);
    });
  } catch {
    alert(err);
  }
}
