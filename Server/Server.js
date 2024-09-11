const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json())
app.use(cors())

mongoose.connect('mongodb://localhost:27017/mernapp')
.then(() =>{
    console.log("connected")
})
.catch((err) =>{
    console.log(err)
})

const todoSchema = new mongoose.Schema({
    title:{
        required : true,
        type : String
    },
    description:{
        required : true,
        type :String
    }
})

const todomodel = mongoose.model('Todo', todoSchema);



app.get('/', (req,res)=> {
    res.send('Hello Guys')
})

// let todos = [];

app.post('/todos', async (req,res) => {
    const { title , description } = req.body;
    // const newTodo = {
    //     id : todos.length +1,
    //     title,
    //     description
    // }
    //  todos.push(newTodo);
    //  console.log(todos)
    try{
         const newTodo = new todomodel({title,description})
         await newTodo.save();
         res.status(201).json(newTodo);
    } catch (error){
        console.log(error)
        res.status(500).json({message : error.message});
    }
   
})

app.get('/todos', async (req,res) =>{
    try {
        const todos = await todomodel.find();
        res.json(todos);
    } catch (error) {
        console.log(error)
        res.status(500).json({message : error.message});
        
    }
    
})

app.put('/todos/:id', async (req , res) => { 

    try {
         const { title , description } = req.body;
    const id = req.params.id;
    const updatedTodo =  await todomodel.findByIdAndUpdate(
        id,{
            title,description
        },
        {new : true}
    )
    if(!updatedTodo) {
        return res.status(404).json({message:"Todo is not found" })
    }
    res.json(updatedTodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({message : error.message});
    }
   

})

app.delete('/todos/:id' ,(req,res) =>{
    try {
        const id = req.params.id;
        const deleteTodo = todomodel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error)
        res.status(500).json({message : error.message});
    }
    
})

app.listen(3000, () =>{
    console.log("server is listening to the port")
})