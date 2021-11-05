const router = require("express").Router();
const Workout = require("../models/Workout.js");

router.put("/api/workouts/:id", ( req, res) => {
    Workout.updateOne(
        {_id: req.params.id}, 
        {$push: {
            exercises: req.body}
        }
    )
    .then(dbUpdate => {
    res.json(dbUpdate);
    })
    .catch(err => {
        res.status(400).json(`There was an error when trying to PUT to the database: ${err}`);
    });
});

router.post("/api/workouts", ({ body }, res) => {
  Workout.create(body)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// GET the workouts
router.get("/api/workouts", (req, res) => {
//   Workout.find({})
//     .sort({ day: 1 })
//     .then(dbWorkout => {
//         res.json(dbWorkout);
//     }) This is much simpler, but doesn't have the aggregate's ability to get the totalDuration
    Workout
    .aggregate([
        // first stage
        { $sort: {day: 1}},
        // second stage
        { $set: {
            totalDuration: {
                // using a reduce function is necessary to access the array exercises and the objects within
                // example: https://docs.mongodb.com/manual/reference/operator/aggregation/reduce/#exp._S_reduce  
                $reduce: {
                    input: "$exercises",
                    initialValue: 0,
                    in: {
                        $add: ["$$value", "$$this.duration"]
                    }
                }
            }
        }},
    ])
    .then(dbWorkout => {
        res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// GET the last workouts in range of 7
// uses sort() to order them descending by date, then limit() to 7 items
router.get("/api/workouts/range", (req, res) => {
    Workout
    // .find( {} )
    // .sort({ day: 1 })
    // .limit(7)
    .aggregate([
        // first stage
        { $sort: {day: -1}},
        // second stage
        { $limit: 7 },
        // third stage
        { $set: {
            totalDuration: {
                // using a reduce function is necessary to access the array exercises and the objects within
                // example: https://docs.mongodb.com/manual/reference/operator/aggregation/reduce/#exp._S_reduce  
                $reduce: {
                    input: "$exercises",
                    initialValue: 0,
                    in: {
                        $add: ["$$value", "$$this.duration"]
                    }
                }
            }
        }},
        //
    ])
    .then(dbWorkout => {
        res.json(dbWorkout);
    })
    .catch(err => {
        res.status(400).json("There was an error while getting workouts in range" + err);
    });
});

// sends the stats.html to the browser
router.get("/stats", (req, res) => {
    res.redirect("/stats.html");
})

// sends the exercise.html to the browser
router.get("/exercise", (req, res) => {
    res.redirect("/exercise.html");
})

module.exports = router;