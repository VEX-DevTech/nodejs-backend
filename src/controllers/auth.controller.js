import User from '../models/user.model.js';
// Importamos modulo para encriptar las contraseñas
import bcrypt from 'bcryptjs';
// Importamos la función para crear tokens
import {createAccessToken} from '../libs/jwt.js'

import axios from 'axios';

// Función para el registro
export const register = async (req, res) => {
    const {username, email, password} = req.body;

    try {
        // Se encripta la contraseña
        const cryptPassword = await bcrypt.hash(password, 10);

        // Se crea el usuario
        const newUser = new User({
            username,
            email,
            password: cryptPassword
        });
        
        // Se lo guarda en la base de datos
        const userSaved = await newUser.save();

        // Se llama a la función para crear un token con el ID del usuario guardado
        const token = await createAccessToken({id: userSaved._id});
        // Se envía el token a la cookie y a json el ID, usuario y email
        res.cookie('token', token);
        res.json({
            token: token,
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
   
};

// Función para el inicio de sesión
export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        // Busca el email en la base de datos
        const userFound = await User.findOne({email});
        if(!userFound) return res.status(400).json({message: "User not found"});

        // Busca si la contraseña coincide con el usuario
        const isMatch = await bcrypt.compare(password, userFound.password);
        if(!isMatch) return res.status(400).json({message: "Incorrect Password"});
        
        // Se llama a la función para crear un token para el ID del usuario solicitado
        const token = await createAccessToken({id: userFound._id});
        // Se envía el token generado a la cookie y a json el ID, username y email
        res.cookie('token', token);
        res.json({
            token: token,
            id: userFound._id,
            username: userFound.username,
            email: userFound.email
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
   
};

// Función para el cierre de sesión
export const logout = async (req, res) => {
    // Estamos reseteando el token para que expire
    res.cookie('token', "", {
        expires: new Date(0)
    });
    return res.sendStatus(200);
};

// Función para la ruta protegida para ver el pefil
export const profile = async (req, res) => {
    const userFound = await User.findById(req.user.id);
    if(!userFound) return res.status(400).json({message: "User not found"});

    return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt
    });
};

// Controlador para obtener transacciones de PagoPlux
export const pagoPlux = async (req, res) => {
    const { numeroIdentificacion, initialDate, finalDate, tipoPago, estado } = req.body;
    // Credenciales para el acceso a la API
    const username = 'o3NXHGmfujN3Tyzp1cyCDu3xst';
    const password = 'TkBhZQP3zwMyx3JwC5HeFqzXM4p0jzsXp0hTbWRnI4riUtJT';
    // Codificamos en formato base64 para colocarlo en el header
    const credentials = `${username}:${password}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');
    const authorizationHeader = `Basic ${encodedCredentials}`;

    try {
        const response = await axios.post('https://apipre.pagoplux.com/intv1/integrations/getTransactionsEstablishmentResource', {
            numeroIdentificacion,
            initialDate,
            finalDate,
            tipoPago,
            estado
        }, {
            headers: {
                'Authorization': authorizationHeader,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching transactions from PagoPlux', error);
        res.status(500).json({ error: 'An error occurred while fetching transactions from PagoPlux' });
    }
};