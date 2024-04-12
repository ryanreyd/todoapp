import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { IoTrash } from 'react-icons/io5';
import { IoCreate } from 'react-icons/io5';
import { IoAdd } from 'react-icons/io5';

const App = () => {
	const [taskData, setTaskData] = useState([]);
	const [task, setTask] = useState('');
	const [errMsg, setErrMsg] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedTask, setSelectedTask] = useState(null);
	const [updatedTask, setUpdatedTask] = useState('');

	//button component
	const AddButton = ({ label, icon, addFunction }) => {
		return (
			<div
				onClick={addFunction}
				className='w-full h-full flex items-center bg-slate-600 justify-center
		  gap-5 px-3 rounded-full hover:bg-slate-500 cursor-pointer'>
				<div>{icon}</div>
				<h1 className='text-white'>{label}</h1>
			</div>
		);
	};

	//error message component
	const PromptError = ({ message }) => {
		return (
			<div className=' w-full flex justify-center'>
				<div className='w-fit flex justify-center bg-red-100 py-2 px-4 rounded-lg shadow-md shadow-red-200 ring-1 ring-red-200'>
					<p className='text-red-600 text-lg'>{message}</p>
				</div>
			</div>
		);
	};

	//input
	const CustomInput = ({
		onBlur,
		placeholder,
		value,
		onChange,
		onKeyDown,
		autoFocus,
	}) => {
		return (
			<div className=' p-2 bg-transparen t flex w-full h-full rounded-md overflow-hidden '>
				<input
					autoFocus={autoFocus}
					onBlur={onBlur}
					placeholder={placeholder}
					value={value}
					onKeyDown={onKeyDown}
					type='text'
					onChange={onChange}
					className='bg-transparent px-2 flex-1 py-1 h-full w-[70%] focus:outline-none border-b-2 border-solid border-slate-300 bg-slate-100'
				/>
			</div>
		);
	};

	//fetch taskList from api
	const fetchData = async () => {
		try {
			// Assuming your Express server is running on http://localhost:5000
			const response = await fetch('http://localhost:5000/task');

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			setTaskData(data.taskList);
		} catch (error) {
			setErrMsg(error.message);
		}
	};

	const handleInputChange = (e) => {
		setTask(e.target.value);
	};
	const handleUpdateChange = (e) => {
		setUpdatedTask(e.target.value);
	};

	//Add task
	const handleAddPress = async () => {
		if (task === '') {
			alert('no task is added');
			setTask('');
		} else {
			try {
				// Assuming your Express server is running on http://localhost:3000
				const response = await fetch('http://localhost:5000/task', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ task }),
				});
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				setTask('');
				fetchData();
			} catch (error) {
				setErrMsg(error.message);
			}
		}
	};

	//delete task
	const deleteTask = async (taskId) => {
		const response = await fetch('http://localhost:5000/task', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ taskId }), // Replace with your actual data
		});
		fetchData();
	};

	//right-click task is done
	const handleContextMenu = async (taskId) => {
		const response = await fetch('http://localhost:5000/task', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ taskId }),
		});
		fetchData();
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className='flex justify-center items-center flex-col shad'>
			<div className='py-10'>
				<h1 className='leading-10 text-slate-700 text-2xl font-bold'>
					Todo list
				</h1>
			</div>
			<div className='w-[30%] max-lg:w-[50%] max-md:w-[60%] max-sm:w-[80%] max rounded-lg relative'>
				<div className=' h-16 w-full flex mb-10 gap-2'>
					<input
						className='h-full w-[70%] focus:outline-none focus:ring-1 text-xl
        focus:ring-slate-500 bg-slate-200 p-4 rounded-full shadow-slate-300 ring-1 ring-slate-300 shadow-md'
						type='text'
						value={task}
						placeholder='Add Task...'
						onChange={handleInputChange}
						onKeyDown={() => {
							if (event.key === 'Enter') {
								handleAddPress();
							}
						}}
					/>
					<div className='w-[30%]'>
						<div
							onClick={handleAddPress}
							className=' relative w-full h-full flex items-center justify-center
            gap-2 pr-5 rounded-full bg-emerald-500 ring-1 ring-emerald-600  shadow-emerald-600 shadow-md
          hover:bg-emerald-400 hover:ring-emerald-500 hover:shadow-emerald-500 cursor-pointer transition-all duration-300'>
							<div>
								<IoAdd size={22} color='white' />
							</div>
							<h1 className='text-white text-xl'>Add</h1>
						</div>
					</div>
				</div>
				<div className='w-full flex gap-1 flex-col'>
					{typeof taskData === 'undefined' ||
					taskData.length === 0 ||
					errMsg !== null ? (
						<div className='border relative p-10 rounded-md'>
							<div className='absolute top-[-20px]'>
								<PromptError
									message={errMsg === null ? 'Task list is empty!' : errMsg}
								/>
							</div>
							<p className='text-2xl text-slate-400 font-semibold'>
								An added task shows here. Please add tasks.
							</p>
						</div>
					) : (
						taskData.map((task, i) => (
							<div
								key={task.id}
								className='flex items-center relative rounded-lg cursor-pointer'
								onContextMenu={(event) => {
									event.preventDefault();
									handleContextMenu(task.id);
								}}>
								<div
									className='flex h-16 w-full shadow-lg ring-1 ring-slate-200 items-center pr-4 justify-between rounded-lg
									bg-white transition-all duration-300 hover:shadow-lg
									hover:transform hover:scale-110 max-sm:hover:scale-105 hover:z-10 
									hover:rounded-lg ease-in-out'>
									{/* render task */}
									<div className='flex h-full items-center justify-center flex-row gap-5 w-full font-semibold text-md'>
										<div
											className={
												task.status === 'done'
													? 'text-white h-full bg-gray-500 w-10 flex justify-center items-center rounded-l-lg'
													: 'text-white h-full bg-emerald-500 w-10 flex justify-center items-center rounded-l-lg'
											}>
											{task.id}
										</div>
										{isEditing && selectedTask === i ? (
											<CustomInput
												autoFocus='autoFocus'
												placeholder={task.taskName}
												key={task.id}
												value={updatedTask}
												onChange={(e) => {
													handleUpdateChange(e);
													console.log(updatedTask);
												}}
												onKeyDown={(e) => {
													if (e.key === 'Enter') {
														setIsEditing(false);
													}
												}}
											/>
										) : (
											<p
												className={
													task.status === 'done'
														? 'text-slate-600 w-full overflow-hidden line-through decoration-2 decoration-red-400'
														: 'text-slate-600 w-full overflow-hidden'
												}>
												{task.taskName}
											</p>
										)}
									</div>

									<div className='ml-3 flex gap-3'>
										<div
											className='p-1 rounded-md hover:bg-gray-300 cursor-pointer'
											onClick={() => {
												setIsEditing(true);

												setSelectedTask(i);
												setUpdatedTask(task.taskName);
											}}>
											<IoCreate size={20} color='gray' />
										</div>
										<div
											className='p-1 rounded-md hover:bg-gray-300 cursor-pointer'
											onClick={() => deleteTask(i)}>
											<IoTrash size={20} color='gray' />
										</div>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default App;
