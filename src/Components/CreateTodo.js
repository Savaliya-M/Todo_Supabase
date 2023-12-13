import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { supabase } from '../Components/supabase';
import { useNavigate } from 'react-router-dom';

const CreateTodo = () => {
  const [formData, setFormData] = useState({

    assigned_to: '',
    todo: '',
    due_date_time: '',
    full_name: '',
    is_completed: false
  });
  const navigate = useNavigate();

  const [assigned_to, setAssigned_to] = useState([]);


  useEffect(() => {
    const fetchManager = async () => {
      try {
        const token = Cookies.get('token');

        const [header, payload, signature] = token.split('.');

        var decodedPayload = JSON.parse(atob(payload));

        if (decodedPayload && decodedPayload.user_metadata.role === 'admin') {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'manager');

          if (error) {
            throw error;
          }
          setAssigned_to(data);
        } else {

          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('manager', decodedPayload.sub);

          if (error) {
            throw error;
          }
          setAssigned_to(data);

        }

      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    }

    fetchManager();


  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'assigned_to') {
      const selectedPerson = assigned_to.find((person) => person.id === value);
      setFormData({
        ...formData,
        assigned_to: value,
        full_name: selectedPerson ? selectedPerson.full_name : '',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.from('Todos').insert([formData]);
    if (error) {
      throw error;
    }
    navigate('/dashboard');
    setFormData({
      assigned_to: '',
      todo: '',
      due_date_time: '',
    });
  };



  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-gray-100 rounded shadow p-6 w-full max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Todo</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assigned_to">
            Assigned Person
          </label>
          <select
            id="assigned_to"
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="" disabled>Select assigned person</option>
            {assigned_to && assigned_to.map((person) => {
              return <option key={person.id} value={person.id}>{person.full_name}</option>
            })}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="todo">
            Task Description
          </label>
          <textarea
            id="todo"
            name="todo"
            value={formData.todo}
            onChange={handleChange}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter task description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="due_date_time">
            Due Date and Time
          </label>
          <input
            type="datetime-local"
            id="due_date_time"
            name="due_date_time"
            value={formData.due_date_time}
            onChange={handleChange}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Todo
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTodo;
