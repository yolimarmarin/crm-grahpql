const mongoose = require('mongoose')

const ClientsSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    company:{
        type: String,
        required: true,
        trim: true
    },
    phone:{
        type: String,
        trim: true
    },
    salesman:{
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        ref: 'User'
    },
    created:{
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Client', ClientsSchema)