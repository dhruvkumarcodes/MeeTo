import { StreamChat } from "stream-chat"
import "dotenv/config"

const apiKey = process.env.STREAM_API
const secretKey = process.env.STREAM_SECRET

if (!apiKey || !secretKey) {
    console.error("ApiKey or secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, secretKey)

export const streamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error upserting Stream user", error)
    }
}

export const generateStreamToken = (userId) => {
    try {
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.error("Error generating Stream token:", error);
    }
};