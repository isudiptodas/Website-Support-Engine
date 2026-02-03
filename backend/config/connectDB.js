
import mongoose from "mongoose";

export const connectDB = async () => {
    const URI = process.env.MONGODB_URL;
    console.log(URI);

    try {
        await mongoose.connect(URI);
        console.log('Database connected');
    } catch (err) {
        console.log(err);
    }
} 