import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    clientName:{
        type:String,
        required: true,
        trim: true
    },
    clientEmail: {
        type:String,
        required: true,
        trim: true
    },
    date:{
        type:String,
        required: true
    },
    time:{
        type:String,
        required: true
    },
    status:{
        type:String,
        default: "pending"
    },

    services:[
        {
            _id: false, //q cada item no genere su propio id
            service: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Service",
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            },
        },
    ],
});

export const bookingModel = mongoose.model("Booking", bookingSchema, "bookings");