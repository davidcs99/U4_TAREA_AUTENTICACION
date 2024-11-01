const mongoose = require('mongoose');

const MateriaSchema = new mongoose.Schema({
    codigo: String,
    nombre: String,
    creditos: Number,
    semestre: String,
    tipo: String,
});

module.exports = mongoose.model('Materia', MateriaSchema);