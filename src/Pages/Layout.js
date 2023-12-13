import React from 'react'
import TodoList from '../Components/TodoList'
import Navbar from '../Components/Navabar';

const Layout = () => {
  return (
    <div className="flex flex-col ">
    <Navbar/>
      <div className="">
        <TodoList />
      </div>
    </div>
  )
}

export default Layout;