const mongoose =  require('mongoose')

const ProductsSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    exist:{
        type: Number,
        require:true,
        trim: true
    },
    price:{
        type: Number,
        require:true,
        trim: true
    },
    created:{
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('Product', ProductsSchema)