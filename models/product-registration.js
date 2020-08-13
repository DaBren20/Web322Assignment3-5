const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const proSchema = new Schema ({
    
    mealName : {
        type : String
    },

    price : {
        type : Number
    },

    description : {
        type : String
    },

    category : {
        type : String
    },

    quantity : {
        type : Number
    },

    topPackage : {
        type : Boolean
    },

    picture : {
        type : String
    }
});

const prodModel = mongoose.model('mealPackages', proSchema);

module.exports = prodModel;