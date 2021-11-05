const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  
  
  exercises: [
    {
      type: { type: String},
      name: String,
      duration: Number,
      weight: Number,
      reps: Number,
      sets: Number,
      distance: Number
    }
  ],
  day: {
    type: Date,
    default: Date.now
  },
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;