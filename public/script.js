async function searchCountry() {
    const country = document.getElementById("countryInput").value.trim();
    const resultDiv = document.getElementById("result");
    const errorP = document.getElementById("error");
    const loadingP = document.getElementById("loading");

    resultDiv.innerHTML = "";
    errorP.textContent = "";

    if (!country) {
        errorP.textContent = "Introdueix un país.";
        return;
    }

    loadingP.style.display = "block";

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);

        if (!response.ok) {
            throw new Error("País no trobat");
        }

        const data = await response.json();
        const countryData = data[0];

        const capital = countryData.capital ? countryData.capital[0] : "No disponible";
        const region = countryData.region || "No disponible";
        const population = countryData.population || 0;
        const flag = countryData.flags?.png || "";

        resultDiv.innerHTML = `
            <div class="country-card">
                <h3>${countryData.name.common}</h3>
                <p><strong>Capital:</strong> ${capital}</p>
                <p><strong>Regió:</strong> ${region}</p>
                <p><strong>Població:</strong> ${population.toLocaleString()}</p>
                <img src="${flag}" width="120">
                <br><br>
                <button onclick='addFavorite(${JSON.stringify({
                    country: countryData.name.common,
                    capital,
                    region,
                    population,
                    flag
                })})'>
                    Afegir a favorits
                </button>
            </div>
        `;
    } catch (error) {
        errorP.textContent = "Error: el país no existeix o no s'ha pogut consultar.";
    } finally {
        loadingP.style.display = "none";
    }
}

async function addFavorite(countryData) {
    try {
        const response = await fetch("/favorites", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(countryData)
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "No s'ha pogut afegir el favorit");
            return;
        }

        loadFavorites();
    } catch (error) {
        alert("Error de connexió amb el microservei");
    }
}

async function loadFavorites() {
    try {
        const response = await fetch("/favorites");
        const data = await response.json();

        const list = document.getElementById("favorites");
        list.innerHTML = "";

        data.forEach(f => {
            const li = document.createElement("li");

            li.innerHTML = `
                <strong>${f.country}</strong><br>
                Capital: ${f.capital}<br>
                Regió: ${f.region}<br>
                Població: ${Number(f.population).toLocaleString()}<br>
                ${f.flag ? `<img src="${f.flag}" width="80"><br>` : ""}
                <button onclick="deleteFavorite(${f.id})">Eliminar</button>
            `;

            list.appendChild(li);
        });
    } catch (error) {
        console.error("Error carregant favorits:", error);
    }
}

async function deleteFavorite(id) {
    try {
        const response = await fetch(`/favorites/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "No s'ha pogut eliminar");
            return;
        }

        loadFavorites();
    } catch (error) {
        alert("Error eliminant la destinació");
    }
}

loadFavorites();