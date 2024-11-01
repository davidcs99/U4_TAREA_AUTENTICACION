const storage = require('./storage')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config');

function getUserByUsername( dato ) {
    return new Promise( (resolve, reject) => {
        if (!dato) {
            reject( 'No existen datos' )
        } else {
            resolve( storage.getUserByUsername( dato ) )
        }
    } )
}

function getUserByRole( dato ) {
    console.log(dato)
    return new Promise( (resolve, reject) => {
        if (!dato) {
            reject( 'No existen registros que coincidan con tu busqueda' )
        } else {
            resolve( storage.getUserByRole( dato ) )
        }
    } )
}

async function register(data) {
    const { 
        nombre, 
        apellido, 
        username, 
        password, 
        role 
    } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    return storage.registerUser(
        {   
            nombre, 
            apellido, 
            username, 
            password: hashedPassword, 
            role 
        });
}

async function login(data) {
    

    try {    
        const { username, password } = data;        
        const users = await storage.getUserByUsername({ username });        
        const user = (Array.isArray(users) && users.length > 0 ) ? users[0] : undefined

        
        if (!user) {
            throw new Error('Usuario no encontrado');
        }        
        
        const isMatch = bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error('Contraseña incorrecta');
        }                
        const token = jwt.sign({ id: user._id, role: user.role },  config.jwtSecret , { expiresIn: config.jwtExpiresIn });        
        return {token};
        
    } catch (err) {
        console.log("controller::login-err", err)
        throw err;
    }
    
    
}

module.exports = {
    getUserByUsername,
    register,
    login,
    getUserByRole
}