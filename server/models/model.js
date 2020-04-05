const mongoose = require('mongoose')

const PrimaryObjectSchema = new mongoose.Schema({

    playerName: {
        type: String,
        required: [true, "Player name is required"]
    },
    
    score: {
        type: Number
    },

    time: {
        type: Number
    }
    
}, { timestamps: true })


mongoose.model("PrimaryObject", PrimaryObjectSchema)