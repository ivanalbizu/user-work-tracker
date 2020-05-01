const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [ true, 'Nombre de usuario obligatorio' ],
        unique: true
    },
    pass: {
        type: String,
        required: [ true, 'Password de usuario obligatorio' ]
    }
});
    
const User = mongoose.model('User', userSchema)

module.exports = User