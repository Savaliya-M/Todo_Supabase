import React, { useEffect, useState } from 'react';
import { supabase } from '../Components/supabase';
import Cookies from 'js-cookie';
import { triggerJob } from './windmill_functions';

const TodoList = () => {
  const [todoItems, setTodoItems] = useState([]);
  const [hoveredTodo, setHoveredTodo] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [comments, setComments] = useState([])
  const [newAssignedPerson, setNewAssignedPerson] = useState('');
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [persons, setPersons] = useState([]);
  const [decodedPayload, setDecodedPayload] = useState({});



  useEffect(() => {
    const fetchTodoList = () => {
      const token = Cookies.get('token');
      const [header, payload, signature] = token.split('.');
      var decoded = JSON.parse(atob(payload));
      setDecodedPayload(decoded)
      if (decoded && (decoded.user_metadata.role === 'manager' || decoded.user_metadata.role === 'user')) {
        supabase
          .from('Todos')
          .select('*')
          .eq('assigned_to', decoded.sub)
          .then((response) => {
            setTodoItems(response.data);
          });
      } else {
        supabase.from('Todos').select('*').then((response) => {
          setTodoItems(response.data);
        });
      }
    };

    fetchTodoList();
  }, []);

  const handleCompleteClick = async (todoId, task) => {
    const confirmed = window.confirm('Are you sure you want to complete this task?');

    if (confirmed) {
      if (task === 'complete') {
        await supabase
          .from('Todos')
          .update({ is_completed: true })
          .eq('id', todoId);
        setTodoItems((prevItems) =>
          prevItems.map((item) => (item.id === todoId ? { ...item, is_completed: true } : item))
        );
      } else {
        await supabase
          .from('Todos')
          .update({ is_completed: false })
          .eq('id', todoId);
        setTodoItems((prevItems) =>
          prevItems.map((item) => (item.id === todoId ? { ...item, is_completed: false } : item))
        );
      }

    }
  };


  const handleAddCommentClick = (todo) => {
    setSelectedTodo(todo);
    setShowCommentsModal(true);
    supabase.from('comments').select().eq('todo_id', todo.id).then((comments) => {
      console.log(comments);
      setComments(comments.data)
    });
  };

  const handleAddComment = async () => {
    await supabase.from('comments').upsert([
      { todo_id: selectedTodo.id, comment: newComment },
    ]);
    setShowCommentsModal(false);
    setSelectedTodo(null);
    setNewComment('');
  };

  const handleReassignClick = async (todo) => {
    setSelectedTodo(todo);
    setNewAssignedPerson('');
    setShowReassignModal(!showReassignModal);


    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'manager');

    if (error) {
      throw error;
    }
    setPersons(data);


  };

  const handleAssignedPersonChange = (event) => {
    setNewAssignedPerson(event.target.value);
  };

  const handleReassignTodo = async () => {

    const user = persons.find((user) => user.id === newAssignedPerson);

    await supabase
      .from('Todos')
      .update({ assigned_to: newAssignedPerson, full_name: user ? user.full_name : '' })
      .eq('id', selectedTodo.id);

    triggerJob("reassign Task").then((result) => { console.log(result); })

    const response = await supabase.from('Todos').select('*');
    setTodoItems(response.data);

    setShowReassignModal(false);
    setSelectedTodo(null);
    setNewAssignedPerson('');
  };


  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="w-full bg-white rounded shadow p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">TodoList</h1>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">Assigned Person</th>
              <th className="py-2 px-4 border-b">Task Description</th>
              <th className="py-2 px-4 border-b">Due Date</th>
              <th className="py-2 px-4 border-b">Due Time</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {todoItems.map((todo) => (
              <tr
                key={todo.id}
                className="border-b text-left"

              >
                <td className="py-2 px-4">
                  {decodedPayload && decodedPayload.user_metadata.role === 'admin' ? <button onClick={() => handleReassignClick(todo)} className="">
                    🔄
                  </button> : <></>}
                  {showReassignModal && selectedTodo.id === todo.id ? <div> <select
                    value={newAssignedPerson}
                    onChange={handleAssignedPersonChange}
                    className=" border p-2 "
                  >
                    <option value="">Select an assigned person</option>
                    {persons.map((person) => (
                      <option key={person.id} value={person.id}>{person.full_name}</option>
                    ))}

                  </select><button onClick={handleReassignTodo} className="ml-2 text-white text-3xl align-middle">
                      ✅
                    </button></div> : todo.full_name}</td>
                <td className="py-2 px-4">{todo.todo}</td>
                <td className="py-2 px-4">{new Date(todo.due_date_time).toLocaleDateString()}</td>
                <td className="py-2 px-4">{new Date(todo.due_date_time).toLocaleTimeString()}</td>
                <td onMouseEnter={() => setHoveredTodo(todo.id)}
                  onMouseLeave={() => setHoveredTodo(null)} className={`py-2 text-center px-4 text-white rounded ${todo.is_completed ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'}`}>
                  {hoveredTodo === todo.id ? todo.is_completed ? (
                    <button
                      onClick={() => handleCompleteClick(todo.id, 'incomplete')}
                      className="  text-white font-bold  rounded"
                    >
                      Incomplete
                    </button>
                  ) : (

                    <button
                      onClick={() => handleCompleteClick(todo.id, 'complete')}
                      className="  text-white font-bold  rounded"
                    >
                      Complete
                    </button>
                  ) : todo.is_completed ? 'complete' : 'incomplete'}
                </td>
                <td>
                  <button onClick={() => handleAddCommentClick(todo)} className="text-blue-500 text-2xl ">
                    💬
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showCommentsModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75">

          <div className="bg-white p-6 rounded shadow-lg">

            <h2 className="text-2xl font-bold mb-4">{selectedTodo?.todo} - Comments</h2>
            <textarea
              rows="4"
              cols="50"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border p-2 mb-4"
              placeholder="Add a comment..."
            />
            <button onClick={handleAddComment} className="bg-blue-500 text-white p-2 rounded">
              Add Comment
            </button><button onClick={() => setShowCommentsModal(false)} className="ml-2 text-gray-500">
              ❌
            </button>
            {comments.map((comment) => (
              <div key={comment.id} className="border-t pt-2 mt-2">
                <p>{comment.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
