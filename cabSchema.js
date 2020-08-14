const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },

});

const cabSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true },
    currentLoc: {
        name: String,
        location: {
            type: pointSchema,
            required: true
        }
    }
});

const bookingSchema = mongoose.Scheme({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        requires : true
    },
    cab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cab',
        require : true
    },
    source: {
        sourceName: String,
        location: {
            type: pointSchema,
            required: true
        }
    },
    dest: {
        destName: String,
        location: {
            type: pointSchema,
            required: true
        }
    }
});



const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinated: {
        type: [Number],
        required: true
    }
});


const User = mongoose.model('User', userSchema);
const Cab = mongoose.model('Cab', CabSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Point = mongoose.model('Point', pointSchema); 



