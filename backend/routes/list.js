const router = require("express").Router();
const List = require("../models/list.js");
const User = require("../models/user.js");

//create
router.post("/addTask", async (req, res) => {
  try {
    // console.log(req.body);
    const { title, id } = req.body;
    const existingUser = await User.findById(id);
    if (existingUser) {
      const list = new List({ title, user: existingUser });
      await list.save().then(() => res.status(200).json({ list }));
      existingUser.list.push(list);
      existingUser.save();
    }
  } catch (error) {
    console.log(error);
  }
});
  router.put("/updateTask/:id", async (req, res) => {
    try {
      console.log(req.body,"hii");
      const { task } = req.body;
      console.log(req.params.id);
      const list = await List.findByIdAndUpdate(req.params.id, { title:task },{new:true});
      list.save().then(() => res.status(200).json({ message: "Task Updated" }));
    } catch (error) {
      console.log(error);
    }
  });
  router.delete("/deleteTask/:id", async (req, res) => {
    try {
      // console.log(req.body,"iddd");
      // console.log(req.params.id);
      // const { userid } = req.body;
    //   const existingUser = await User.findByIdAndUpdate(req.params.userId , {
    //     $pull: { list: req.params.id } ,
    //   },        {new:true}
    // );
      // if (existingUser) {
       
      // }
      await List.findByIdAndDelete(req.params.id).then(() =>
      res.status(200).json({ message: "Task Deleted" })
    );
    } catch (error) {
      console.log(error);
    }
  });
  router.get("/getTasks/:id", async (req, res) => {
    const list = await List.find({ user: req.params.id }).sort({ createdAt: -1 });
    if (list.length !== 0) {
      res.status(200).json({ list });
    } else {
      res.status(200).json({ message: "No tasks found" });
    }
  });



module.exports = router;