import mongoose from 'mongoose';

type connectionObject = {
    isConnected?: number
};

const connection: connectionObject = {};

export default async function dbConnect(): Promise<void> {
    try {
        if (connection.isConnected) {
            console.log("Already connected to database...")
            return
        }
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
        connection.isConnected = db.connections[0].readyState;
        console.log("DB connected succesfully.")
    } catch (error) {
        console.log(error)
        console.error("DB connection failed");
        process.exit(1);
    }
}