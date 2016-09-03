var mongoose = require('mongoose');

// create Schema
var dataSchema = mongoose.Schema({
	host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Host'
    },
    cpu: [Number],
    totalMemory: Number,
    freeMemory: Number,
    usedMemory: Number,
    uptime: Number,
    added : { type: Date, default: Date.now },
});

// add method here
/*serverSchema.methods.speak = function () {

}*/

// create model then export it
module.exports = mongoose.model('Data', dataSchema);  