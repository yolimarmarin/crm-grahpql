const  mongoose = require('mongoose')

const OrdersSchema = mongoose.Schema({
    order: {
        type: Array,
        require:true,
    },
    total: {
        type: Number,
        require: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        ref: 'Client'
    },
    salesman: {
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        ref: 'User'
    },
    state: {
        type: String,
        require:true,
        default: 'pending'
    },
    created:{
        type: Date,
        default: Date.now()
    }

})

module.exports = mongoose.model('Order',OrdersSchema)