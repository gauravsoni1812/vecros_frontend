/* eslint-disable no-unused-vars */
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';

const Admin = () => {
  const { id } = useParams();

  const { isPending, data } = useQuery({
    queryKey: ['getAllQuiz'],
    queryFn: () =>
      fetch(`https://backend-vecros-1.onrender.com/getscore/${id}`).then((res) => res.json()),
  });

  // Show loading state
  if (isPending) {
    return <div>Loading....</div>;
  }

  // Check if data is available
  if (!data || !data.scores) {
    return <div>No data found</div>;
  }

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
            <div className="text-xl text-blue-500 font-bold">{user.score} / 10</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
