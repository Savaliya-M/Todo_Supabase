import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from '../Components/Navabar'
import TodoList from '../Components/TodoList'
import CreateTodo from '../Components/CreateTodo'
import TeamsTodos from '../Components/TeamsTodos'

const Dashboard = () => {
  return (
    <div className="flex flex-col ">
      <Navbar />
      <div className='flex-grow'>
        <Routes>
          <Route exact path='/' element={<TodoList />} />
          <Route exact path="/create" element={<CreateTodo />} />
          <Route exact path="/teamstodos" element={<TeamsTodos />} />
        </Routes>
      </div>
    </div>
  )
}

export default Dashboard