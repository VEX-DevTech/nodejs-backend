// Importamos modulo para crear tokens
import jwt from 'jsonwebtoken';
// Se importa el token secreto de config
import {TOKEN_SECRET} from '../config.js';


// Se configura la función que va a crear el token
export function createAccessToken(payload) {
    return new Promise((resolve, reject)=> {
        jwt.sign(
            payload,
            TOKEN_SECRET,
            {
                expiresIn: "1d",
            },
            (err, token)=> {
                if(err) console.log(err);
                resolve(token);
            }
        );
    });
}