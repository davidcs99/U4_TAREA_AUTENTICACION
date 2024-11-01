const express = require('express')
const jwt = require('jsonwebtoken');
const config = require('../../config');
const controller = require('./controller')
const response = require('../../network/response')

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No se puede realizar la acción, Token no encontrado' });

    jwt.verify(token, config.jwtSecret, (err, user) => {
        console.log("authenticateToken-error", err)
        if (err) return res.status(401).json({ message: 'Token inválido' });
        req.user = user;
        next();
    });
}

function authorizeRoles(roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Su rol de usuario no le permite realizar esta acción' });
        }
        next();
    };
}

const routes = express.Router()

routes.post('/registerUser', function(req, res) {
    controller.register(req.body)
        .then(data => response.success(req, res, data, 200) )
        .catch(error => response.error(req, res, error, 400) )
})

routes.post('/login', function(req, res) {
    controller.login(req.body)
        .then(data => response.success(req, res, { token: data.token }, 200))
        .catch(error => response.error(req, res, error, 400))
})

routes.get('/getUserByUsername', function(req, res) {
    controller.getUserByUsername(req.body)
        .then(data => response.success(req, res, data, 200) )
        .catch(error => response.error(req, res, error, 400) )
})
routes.get('/getUserByRole', function(req, res) {
    controller.getUserByRole(req.body)
        .then(data => response.success(req, res, data, 200) )
        .catch(error => response.error(req, res, error, 400) )
})


module.exports = { routes, authenticateToken, authorizeRoles };