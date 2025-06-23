import mongoose from 'mongoose';

export const mongoDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        if(conn) console.log('MongoDb connected');
    } catch (error) {
        console.log("MongoDb connection error:",error);
    }
}

