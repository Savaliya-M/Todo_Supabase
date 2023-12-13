import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { supabase } from '../Components/supabase';

const Navbar = () => {
  const [role, setRole] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      const [header, payload, signature] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      setRole(decodedPayload.user_metadata.role);
      setFullName(decodedPayload.user_metadata.full_name);
    }
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut()
    Cookies.remove('token');
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-start">
          {fullName && (
            <span className="text-white">{fullName}</span>
          )}
        </div>
        <div className="flex items-center flex-grow justify-center">

          <Link to="/" className="text-white text-2xl font-bold">
            Todo App
          </Link>
        </div>
        <div className="flex space-x-4">
          <div className="flex space-x-4 ml-auto">

            {role && role === 'manager' && (
              <Link to="/dashboard/teamstodos" className="text-white">
                Team Todos
              </Link>
            )}
            {(role === 'admin' || role === 'manager') && (
              <Link to="/dashboard/create" className="text-white">
                Create Todo
              </Link>
            )}
            <button onClick={handleLogout} className="text-white cursor-pointer">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

  );
};

export default Navbar;
