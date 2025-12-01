document.addEventListener("DOMContentLoaded", async () => {
  const matchesContainer = document.getElementById("matches-container");
  const investorNameSpan = document.getElementById("investor-name"); 

  const urlParams = new URLSearchParams(window.location.search);
  const investorId = urlParams.get("id");

  if (!investorId) {
    matchesContainer.innerHTML = "<p>ID not found</p>";
    return;
  }
  try {
    const response = await fetch(`http://localhost:3000/matches/${investorId}`);
    if (!response.ok) {
      if (response.status === 404) {
        matchesContainer.innerHTML =
          "<p>Ошибка: Инвестор с таким ID не найден.</p>";
        return;
      }
      throw new Error(`Server returned status: ${response.status}`);
    }

    const data = await response.json();
    const investor = data.investor; // Получаем данные инвестора
    const matches = data.matches;

    if (investorNameSpan && investor.name) {
      investorNameSpan.textContent = investor.name;
    }

    if (matches.length === 0) {
      matchesContainer.innerHTML =
        "<p>This is most populat projects for today, but they can be not relevatnt for your intersts </p>";
      return;
    }

    matches.forEach((startup) => {
      const card = document.getElementById("matches-container");
      card.className = "startup-card";
      card.innerHTML = `
                <h2>${startup.name}</h2>
                <p>Industry: ${startup.industries.join(", ")}</p>
                <p>Stage: ${startup.stages.join(", ")}</p>
                <div class="stamp">место для печати был/небыл</div>
            `;
      matchesContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Fetch Matches Error:", error);
  }
});
