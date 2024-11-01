const model = require('./model')

async function registerUser(dato) {
    const resultado = await new model(dato)
    return resultado.save()
}

async function getUserByUsername(dato) {
     let filter = {}
     
     if (dato.username) {
        filter = { username: dato.username }        
     } 
     const resultado = await model.find( filter )     
     return resultado
}

async function getUserByRole(dato) {
     let filter = {}
     if (dato.role) {
        filter = { role: dato.role }        
     } 
     const resultado = await model.find( filter )     
     return resultado
}

module.exports = {
    registerUser:registerUser,
    getUserByUsername:getUserByUsername,
    getUserByRole:getUserByRole,
}