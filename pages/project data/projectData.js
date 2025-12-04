const investor = document.createElement("div");


 try {
    const response = await fetch("http://localhost:3000/organizations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formInvestorData),
    });

    const data = await response.json();
    console.log(data);

    const regNewInvestor = data.receivedData.id;

    window.location.href = `./scannedResults.html?id=${regNewInvestor}`;

    investorForm.reset();
  } catch (error) {
    console.error("Error:", error);
  }
