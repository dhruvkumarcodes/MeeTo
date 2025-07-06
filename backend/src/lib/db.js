import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected");
    } catch (error) {
        console.log("error in connected to database", error);
    }
}