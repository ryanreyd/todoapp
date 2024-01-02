import React from "react"
import { useState, useEffect } from "react"
import { IoTrash } from "react-icons/io5"
import { IoCreate } from "react-icons/io5"
import { IoAdd } from "react-icons/io5"

const App = () => {

  const [taskData, setTaskData] = useState([])
  const [task, setTask] = useState('')
  const [taskCounter, setTaskCounter] = useState(0)

  //fetch taskList from api
  const fetchData = async() => {
    try {
      // Assuming your Express server is running on http://localhost:3000
      const response = await fetch('http://localhost:5000/task');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setTaskData(data.taskList);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } 
  };

  useEffect(() =>{
    fetchData()
  },[])

  const handleInputChange = (e) =>{
    setTask(e.target.value)
  }

  //Add task
  const handleAddPress = async() =>{
    if(task === ''){
      alert('no task is added')
      setTask('')
    }else{
      try {
        // Assuming your Express server is running on http://localhost:3000
        const response = await fetch('http://localhost:5000/task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({task}), // Replace with your actual data
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setTask('')
        fetchData();
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } 
    }
  }

  //delete task

  

  const deleteTask = async(taskId) =>{
    const response = await fetch('http://localhost:5000/task', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({taskId}), // Replace with your actual data
    });
    fetchData()
  }

  const AddButton = ({label, icon, addFunction}) =>{
    return(
      <div onClick={addFunction} className="w-full h-full flex items-center bg-slate-600 justify-center
      gap-5 px-3 rounded-full hover:bg-slate-500 cursor-pointer">
        <div>
          {icon}
        </div>
        <h1 className="text-white">{label}</h1>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center flex-col shad">
      <div className="py-10">
       <h1 className="leading-10 text-slate-700 text-2xl font-bold">Todo list</h1>
      </div>
      <div className="w-[30%] max-lg:w-[50%] max-md:w-[60%] max-sm:w-[80%] max rounded-lg relative">
        <div className=" h-16 w-full flex mb-10 gap-2">
          <input className="h-full w-[70%] focus:outline-none focus:ring-1 text-xl
        focus:ring-slate-500 bg-slate-200 p-4 rounded-full shadow-lg"
           type="text"
           value={task}
           placeholder="Add Task..."
           onChange={handleInputChange}
           onKeyPress={()=>{
            if(event.key === 'Enter'){
              handleAddPress()
            }
           }}
          /> 
          <div className="w-[30%]">
            <div onClick={handleAddPress} className=" relative w-full h-full flex items-center bg-emerald-600 shadow-emerald-200 justify-center
            gap-2 pr-5 rounded-full hover:bg-emerald-500 cursor-pointer transition-all duration-300 shadow-lg">
              <div>
                <IoAdd size={22} color="white"/>
              </div>
              <h1 className="text-white text-xl">Add</h1>
            </div>
          </div>   
        </div>
        <div className="w-full flex gap-1 flex-col">
          {(typeof taskData === 'undefined' || taskData.length === 0) 
          ? (
            <h1 className=" text-2xl text-slate-400 font-semibold p-16">
              No task found! Added Task shows here.
            </h1>
          )
          :
          (
            taskData.map((task, i) =>(
              <div key={i} className="flex items-center relative rounded-lg"> 
                <div className="flex h-16 w-full shadow-lg ring-1 ring-slate-200 items-center pr-4 justify-between rounded-lg
                bg-white transition-all duration-300 hover:shadow-lg
                  hover:transform hover:scale-110 max-sm:hover:scale-105 hover:z-10 
                  hover:rounded-lg ease-in-out"
                >
                  {/* render task */}
                <div className="flex h-full items-center justify-center flex-row gap-10 font-semibold text-md">
                  <div className="text-white h-full bg-emerald-500 w-10 flex justify-center items-center rounded-l-lg">{i+1}</div>
                  <p className="text-slate-600">{task}</p>
                </div>

                  <div className="flex gap-3">
                    <div className="p-1 rounded-md hover:bg-gray-300 cursor-pointer">
                      <IoCreate size={20} color="gray"/>
                    </div> 
                    <div className="p-1 rounded-md hover:bg-gray-300 cursor-pointer"
                      onClick={() => deleteTask(i)}>
                      <IoTrash size={20} color="gray"/> 
                    </div> 
                  </div>
                </div>
              </div>
            ))
          )}
        </div>  
      </div>  
    </div>
  )
}

export default App