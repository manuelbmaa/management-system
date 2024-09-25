import mongoose from "mongoose";

const {MONGODB_URI} = process.env

if(!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in .env file')
}

export const connectDB = async () => {
    try {
        const {connection} = await mongoose.connect(MONGODB_URI);
        if(connection.readyState === 1){
            console.log('Connected to MongoDB');
            return Promise.resolve(true);
        }
    } catch(error){
        console.error(error);
        return Promise.reject(false);
    }
}; 