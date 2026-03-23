const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir frontend
app.use(express.static("public"));

// "Base de dades" en memòria
let favorites = [];

/* =========================
   GET - obtenir favorits
========================= */
app.get("/favorites", (req, res) => {
    res.status(200).json(favorites);
});

/* =========================
   POST - afegir favorit
========================= */
app.post("/favorites", (req, res) => {
    const { country, capital, region, population, flag } = req.body;

    if (!country || country.trim() === "") {
        return res.status(400).json({
            error: "El camp 'country' és obligatori"
        });
    }

    // Evitar duplicats
    const exists = favorites.find(
        f => f.country.toLowerCase() === country.toLowerCase()
    );

    if (exists) {
        return res.status(409).json({
            error: "Aquesta destinació ja està guardada"
        });
    }

    const newFavorite = {
        id: Date.now(),
        country: country,
        capital: capital || "No disponible",
        region: region || "No disponible",
        population: population || 0,
        flag: flag || ""
    };

    favorites.push(newFavorite);

    res.status(201).json(newFavorite);
});

/* =========================
   DELETE - eliminar favorit
========================= */
app.delete("/favorites/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const exists = favorites.find(f => f.id === id);

    if (!exists) {
        return res.status(404).json({
            error: "Destinació no trobada"
        });
    }

    favorites = favorites.filter(f => f.id !== id);

    res.status(200).json({
        message: "Destinació eliminada correctament"
    });
});

/* =========================
   PUT - actualitzar favorit
========================= */
app.put("/favorites/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const favorite = favorites.find(f => f.id === id);

    if (!favorite) {
        return res.status(404).json({
            error: "Destinació no trobada"
        });
    }

    const { country, capital, region, population, flag } = req.body;

    if (country && country.trim() !== "") favorite.country = country;
    if (capital) favorite.capital = capital;
    if (region) favorite.region = region;
    if (population) favorite.population = population;
    if (flag) favorite.flag = flag;

    res.status(200).json(favorite);
});

app.listen(PORT, () => {
    console.log(`Servidor executant-se en el port ${PORT}`);
});