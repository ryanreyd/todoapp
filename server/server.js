const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(cors());
// Middleware to parse JSON in the request body
app.use(bodyParser.json());

const filePath = 'task/task.json'
const dataFolderPath = 'task';

app.get('/task', (req, res) => {
  const taskList = fs.readFileSync(filePath, 'utf8');
  res.status(200).send(taskList)
})

//add task
app.post('/task', (req, res) => {
  try {
    // Create the folder if it doesn't exist
    if (!fs.existsSync(dataFolderPath)) {
      fs.mkdirSync(dataFolderPath)
    }

    // Create or overwrite the JSON file with the posted data
    const newTask = req.body
    const existingTask = fs.readFileSync(filePath, 'utf8')
    const toObj = JSON.parse(existingTask)
    const objLength = toObj.taskList.length+1
/*     toObj.taskList = {task:Object.values(newTask)[0], id:Object.keys(toObj).length } */
    toObj.taskList.push({taskName:Object.values(newTask)[0], id: objLength, status: 'active'})
/*     toObj.taskList.push(Object.values(newTask)[0]) */
    const toJson = JSON.stringify(toObj, null, 2)
    fs.writeFileSync(filePath, toJson, 'utf8')

    const response = {
      message: Object.values(newTask)[0] +' is added',
    };
  
    // Sending the JSON response
    res.json(response);
  } catch (error) {
    console.error('Error creating task folder and JSON file:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
})

//DELETE task
app.delete('/task', (req, res) => {

  const taskId = req.body

  const storedTask  = fs.readFileSync(filePath, 'utf8')

  const list = JSON.parse(storedTask)

  list.taskList.splice(Object.values(taskId), 1)

  const updatedList = JSON.stringify(list, null, 2)
  
  //save as .json file
  fs.writeFileSync(filePath, updatedList, 'utf8')

  res.json(taskId)
})

//update task
app.put('/task', (req, res)=>{
  try {
    
    // Create or overwrite the JSON file with the posted data
    const taskId = req.body
    const existingTask = fs.readFileSync(filePath, 'utf8')
    const toObj = JSON.parse(existingTask)
/*     toObj.taskList = {task:Object.values(newTask)[0], id:Object.keys(toObj).length } */
/*     toObj.taskList.push(Object.values(newTask)[0]) */

  /*   toObj.taskList.map((task)=>{
      if(taskId === task.id){
        task.status = 'done'
      }
    }) */
    toObj.taskList[taskId.taskId-1].status='done'

    const toJson = JSON.stringify(toObj, null, 2)
    fs.writeFileSync(filePath, toJson, 'utf8')

    const response = {
      message: toObj.taskList[taskId.taskId-1].taskName+'status is set done'
    };
  
    // Sending the JSON response
    res.json(response);
  } catch (error) {
    console.error('Error creating task folder and JSON file:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

