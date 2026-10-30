import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        trim: true
    },
    description: {
        type:String, 
        required: true, 
        trim : true 
    },
    duration: {
        type: Number, 
        required: true,
        min: 15
    },
    price: {
        type: Number, 
        required : true,
        min: 0
    },
    category: {
        type: String, 
        required: true
    },
    available:{
        type: Boolean,
        required: true
    }
},
    {
        timestamps: true
    }
);

export const serviceModel = mongoose.model("Service", serviceSchema,"services");

