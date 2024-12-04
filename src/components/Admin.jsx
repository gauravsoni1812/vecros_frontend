/* eslint-disable no-unused-vars */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';  // Import delete icon from react-icons

const Admin = () => {
  const { id } = useParams();  // Quiz ID from URL parameters
  const queryClient = useQueryClient();  // Used to refetch or update the cache after mutation

  // Fetch the quiz score data
  const { isLoading, data } = useQuery({
    queryKey: ['getAllQuiz'],
    queryFn: () =>
      fetch(`https://backend-vecros-1.onrender.com/getscore/${id}`).then((res) => res.json()),
  });

  // Mutation to handle the resetting of the user's answers
  const resetUserAnswersMutation = useMutation({
    mutationFn: (userId) => {
      return fetch(`https://backend-vecros-1.onrender.com/resetuseranswers?id=${id}&userId=${userId}`, {
        method: 'DELETE',  // Assuming the API uses POST to reset answers
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['getAllQuiz']);
    },
  });


  // const mutation = useMutation({
  //   mutationFn: (newTodo) => {
  //     return axios.post('/todos', newTodo)
  //   },
  // })

  // Show loading state
  if (isLoading) {
    return <div>Loading....</div>;
  }

  // Check if data is available
  if (!data || !data.scores) {
    return <div>No data found</div>;
  }

  // Handle reset user answers
  const handleResetUserAnswers = (userId) => {
    if (window.confirm('Are you sure you want to reset this user\'s answers?')) {
      resetUserAnswersMutation.mutate(userId);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">User Scores for Quiz <span className='text-indigo-800'>{data.quizName}</span></h1>
      <div className="space-y-6">
        {data.scores.map((user) => (
          <div
            key={user.userId}
            className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="font-semibold text-xl">{user.userName}</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-xl text-blue-500 font-bold">{user.score} / 10</div>
              {/* Reset Icon */}
              <button
                onClick={() => handleResetUserAnswers(user.userId)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrashAlt size={20} /> {/* Delete icon here */}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
