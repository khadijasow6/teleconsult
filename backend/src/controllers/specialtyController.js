const db = require("../config/db");

const getSpecialties = async (req, res) => {
try {
const [specialties] = await db.query(
"SELECT * FROM specialties ORDER BY id ASC"
);


return res.status(200).json({
  specialties,
});


} catch (error) {
console.error("Erreur récupération spécialités :", error);

return res.status(500).json({
  message: "Impossible de récupérer les spécialités.",
});


}
};

module.exports = {
getSpecialties,
};
