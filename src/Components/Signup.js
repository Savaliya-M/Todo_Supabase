import React, { useState, useEffect } from 'react';
import { supabase } from '../Components/supabase';
import md5 from 'md5';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        manager: '',
    });

    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        manager: '',
        general: '',
    });
    const [managers, setManagers] = useState([])
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchManager = async () => {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('role', 'manager');

                if (error) {
                    throw error;
                }
                setManagers(data)
            } catch (error) {
                console.error('Error fetching users:', error.message);
            }
        }

        fetchManager();
    }, [formData.role])



    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.fullName) newErrors.fullName = 'Full name is required.';
        if (!formData.email) newErrors.email = 'Email is required.';
        if (!formData.password) newErrors.password = 'Password is required.';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required.';
        if (!formData.role) newErrors.role = 'Role is required.';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format.';

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
        if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Password must be at least 6 characters and include at least one special character and one number.';
        }

        setErrors({
            ...newErrors,
            general: Object.keys(newErrors).length ? 'Please fix the errors before submitting.' : '',
        });

        if (Object.keys(newErrors).length === 0) {
            try {
                const hashedPassword = md5(formData.password);

                const { user, error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: hashedPassword,
                    options: {
                        data: {
                            full_name: formData.fullName,
                            role: formData.role,
                            manager: formData.manager,
                        },
                    }
                });


                if (error) {
                    throw error;
                }
                navigate('/')
                setErrors('');
            } catch (error) {
                console.error('Error inserting user data:', error.message);
                setErrors({
                    ...errors,
                    general: 'Error inserting user data.',
                });
            }
        }
    };



    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Signup</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                        Full Name:
                    </label>
                    <input
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 ${errors.fullName ? 'border-red-500' : ''
                            }`}
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                    {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email:
                    </label>
                    <input
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 ${errors.email ? 'border-red-500' : ''
                            }`}
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password:
                    </label>
                    <input
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 ${errors.password ? 'border-red-500' : ''
                            }`}
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                        Confirm Password:
                    </label>
                    <input
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 ${errors.confirmPassword ? 'border-red-500' : ''
                            }`}
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                        Role:
                    </label>
                    <select
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 ${errors.role ? 'border-red-500' : ''
                            }`}
                        name="role"
                        id="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="">Select a role</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="user">User</option>
                    </select>
                    {errors.role && (
                        <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                    )}
                </div>
                {formData.role === 'user' && (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="manager">
                            Manager:
                        </label>
                        <select
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 ${errors.manager ? 'border-red-500' : ''
                                }`}
                            name="manager"
                            id="manager"
                            value={formData.manager}
                            onChange={handleChange}
                        >
                            <option value="">Select a manager</option>
                            {managers && managers.map((manager) => {
                                return (
                                    <option key={manager.id} value={manager.id}>{manager.full_name}</option>
                                )
                            })}
                        </select>
                        {errors.manager && (
                            <p className="text-red-500 text-sm mt-1">{errors.manager}</p>
                        )}
                    </div>
                )}
                {errors.general && (
                    <p className="text-red-500 text-sm mb-4">{errors.general}</p>
                )}
                <button
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
                    type="submit"
                >
                    Signup
                </button>
                <div className="mt-4 text-center">
                    <p>
                        Already have an account?{' '}
                        <Link to="/" className="text-blue-500 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Signup;
