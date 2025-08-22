const searchBtn  = document.getElementById("search-btn");
const countryInp = document.getElementById("country-inp");
const result     = document.getElementById("result");

function renderCountry(country) {
  // Monnaie
  const currencyKey  = country.currencies ? Object.keys(country.currencies)[0] : null;
  const currencyName = currencyKey ? country.currencies[currencyKey].name : "N/A";

  // Langues
  const languages = country.languages ? Object.values(country.languages).join(", ") : "N/A";

  // Capital/continent
  const capital   = country.capital?.[0] ?? "N/A";
  const continent = country.continents?.[0] ?? "N/A";

  // Gestion du drapeau
  let flagHtml = `<img src="${country.flags?.svg || country.flags?.png || ""}" class="flag-img" alt="Flag">`;

  // Cas spécial Afghanistan → texte à la place du drapeau
  if (country.cca2 === "AF") {
    flagHtml = `<p style="color:red; font-weight:bold; font-size:18px;">We don't have any flag</p>`;
  }

  result.innerHTML = `
    ${flagHtml}
    <h2>${country.name?.common ?? "Unknown"}</h2>

    <div class="wrapper"><div class="data-wrapper">
      <h4>Capital:</h4><span>${capital}</span>
    </div></div>

    <div class="wrapper"><div class="data-wrapper">
      <h4>Continent:</h4><span>${continent}</span>
    </div></div>

    <div class="wrapper"><div class="data-wrapper">
      <h4>Population:</h4><span>${(country.population ?? 0).toLocaleString()}</span>
    </div></div>

    <div class="wrapper"><div class="data-wrapper">
      <h4>Currency:</h4><span>${currencyName} - ${currencyKey ?? "N/A"}</span>
    </div></div>

    <div class="wrapper"><div class="data-wrapper">
      <h4>Languages:</h4><span>${languages}</span>
    </div></div>
  `;
}

function searchCountry() {
  const countryName = countryInp.value.trim();
  if (!countryName) {
    result.innerHTML = `<p style="color:red">⚠️ Veuillez entrer un pays</p>`;
    return;
  }

  const finalURL = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`;
  fetch(finalURL)
    .then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) throw new Error("empty");
      renderCountry(data[0]);
    })
    .catch((err) => {
      console.error(err);
      result.innerHTML = `<p style="color:red">❌ Pays introuvable</p>`;
    });
}

searchBtn.addEventListener("click", searchCountry);
countryInp.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchCountry();
});