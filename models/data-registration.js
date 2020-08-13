const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const uSchema = new Schema({
    firstName: {
        type: String
    },

    lastName: {
        type: String
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    type: {
        type:String, 
        default:"User"
    }
});

uSchema.pre("save", function(next) {

    bcrypt.genSalt(10)
    .then(salt=> {
        bcrypt.hash(this.password, salt)
        .then(hash=>{
            this.password=hash
            next();
        })
    })
})

const userModel = mongoose.model('Assignment', uSchema);

module.exports = userModel;