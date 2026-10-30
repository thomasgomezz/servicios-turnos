import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        user:{
            type: String,
            required: true,
            trim: true
        },
        message:{
            type: String,
            required: true,
            trim: true
        },
    },
    {
        timestamps: true //agrga createdAt y updatedAt solos
    }
);

export const messageModel = mongoose.model("Message", messageSchema, "messages");