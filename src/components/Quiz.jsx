import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

export const Quiz = () => {
  const { id } = useParams();
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  // Extract userId from token
  const authToken = Cookies.get("authToken");
  const userId = jwtDecode(authToken).userId
  // console.log(userId)

  // Fetch quiz data using React Query
  const { isLoading, data } = useQuery({
    queryKey: ["getAllQuestions", id, userId, showResult],
    queryFn: () =>
      fetch(`https://backend-vecros-1.onrender.com/getQuiz?id=${id}&userId=${userId}`).then((res) => res.json()),
    enabled: !!userId, // Ensure query runs only if userId is available
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const quiz = data.quizzes[0]; // Assuming there's only one quiz in the response
  const questions = quiz?.questions || [];

  const handleOptionClick = (questionIndex, optionKey) => {
    const correctAnswer = questions[questionIndex].correctOption;
    const isCorrect = optionKey === correctAnswer;

    // Update selectedAnswers
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = {
      isCorrect,
      selectedOption: optionKey,
      chooseAns: optionKey, // Track the chosen answer
    };
    setSelectedAnswers(updatedAnswers);

    // Update the score if correct
    if (isCorrect) {
      setScore(score + 1);
    }

    // Send the answer to the backend
    const questionId = questions[questionIndex].id;
    fetch("https://backend-vecros-1.onrender.com/userAns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        questionId,
        selectedAnswer: optionKey,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Answer submitted successfully:", data);
      })
      .catch((error) => {
        console.error("Error submitting answer:", error);
      });
  };

  const handleSubmit = () => {
    setScore(score + data.score)
    setShowResult(true);
  };
  const progress = (selectedAnswers.length + data.totalAttemptedQuestions / questions.length) * 100;
  console.log(progress)

  if (showResult || data.totalAttemptedQuestions === questions.length) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10 text-center">
        <h1 className="text-4xl font-bold mb-6">Quiz Results</h1>
        <p className="text-2xl">
          You scored <span className="text-green-500 font-bold">{data.score}</span> out of {questions.length}.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">{quiz?.name || "Quiz"}</h1>
      <div className="space-y-6">
        {questions.map((currentQuestion, questionIndex) => {
          const userChosenAnswer = currentQuestion.chooseAns; // The answer chosen by the user
          const correctAnswer = currentQuestion.correctOption; // The correct answer for the question
          if (userChosenAnswer !== null) {
            return (
              <div key={currentQuestion.id} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
                <div className="space-y-4">
                  {["optionA", "optionB", "optionC", "optionD"].map((optionKey, index) => {
                    const optionText = currentQuestion[optionKey];

                    // Determine the background color
                    let bgColor = "bg-gray-100 hover:bg-gray-200"; // Default

                    if (userChosenAnswer) {
                      if (optionKey === correctAnswer) {
                        bgColor = "bg-green-500 text-white"; // Correct answer
                      } else if (optionKey === userChosenAnswer && optionKey !== correctAnswer) {
                        bgColor = "bg-red-500 text-white"; // Wrong answer chosen by user
                      } else {
                        bgColor = "bg-gray-200"; // Unselected options
                      }
                    }
                    return (
                      <div
                        key={index}
                        onClick={() =>
                          !userChosenAnswer && handleOptionClick(questionIndex, optionKey)
                        }
                        className={`p-4 rounded-md cursor-pointer ${userChosenAnswer ? "cursor-not-allowed" : ""
                          } ${bgColor}`}
                      >
                        {optionText}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          } else {
            return (
              <div key={currentQuestion.id} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
                <div className="space-y-4">
                  {["optionA", "optionB", "optionC", "optionD"].map((optionKey, index) => {
                    const optionText = currentQuestion[optionKey];
                    const isCorrect = optionKey === correctAnswer; // Check if the option is correct
                    const isSelected =
                      selectedAnswers[questionIndex]?.selectedOption === optionKey; // Check if this option is selected

                    // Default background color for unselected options
                    let bgColor = "bg-gray-100 hover:bg-gray-200";

                    if (isSelected) {
                      // If the option is selected and it's the correct answer, apply green
                      bgColor = isCorrect
                        ? "bg-green-500 text-white" // Correct answer
                        : "bg-red-500 text-white"; // Wrong answer
                    }
                   


                    // If the answer is not selected and the question has been answered, show the correct answer
                    if (!isSelected && currentQuestion.chooseAns !== null) {
                      bgColor = isCorrect ? "bg-green-500 text-white" : bgColor; // Correct answer in green
                    }


                    return (
                      <div
                        key={index}
                        onClick={() => {
                          if (!selectedAnswers[questionIndex]?.selectedOption) {
                            handleOptionClick(questionIndex, optionKey); // Allow selection if not already selected
                          }
                        }}
                        className={`p-4 rounded-md cursor-pointer ${isSelected ? "" : "hover:bg-gray-200"} ${bgColor}`}
                      >
                        {optionText}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }
        })}
      </div>

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-200 h-2.5">
        <div className="h-full bg-blue-500" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={handleSubmit}
          disabled={selectedAnswers.length < questions.length}
          className={`px-6 py-3 text-lg font-bold text-white rounded-md ${selectedAnswers.length < questions.length
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );

};
