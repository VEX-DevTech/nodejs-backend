import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        mongoose.connect('mongodb+srv://admin:5NPpRBTFgzVyYDNU@cluster0.7umilvc.mongodb.net/prueba-tecnica-db?retryWrites=true&w=majority&authSource=admin');
        console.log('Conexión a la base de datos de autenticación exitosa')
    } catch (error) {
        console.log(error)
    }
};