const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Bienvenue sur TeleConsult");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});