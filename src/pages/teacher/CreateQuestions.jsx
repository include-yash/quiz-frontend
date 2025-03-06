import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlus, FaSave, FaTimes, FaCheck } from 'react-icons/fa'; // Icons for buttons
import { TeacherAuthContext } from '../../context/TeacherAuthContext'; // Import TeacherAuthContext

const CreateQuestions = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { user } = useContext(TeacherAuthContext); // Assuming user is a teacher object and token is the auth token
    const token = localStorage.getItem('token-teach');
    const { testName, testID, department, section } = location.state || {};

    const [showPopup, setShowPopup] = useState(false);
    const [questionType, setQuestionType] = useState('');
    const [questions, setQuestions] = useState([]);
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctOption, setCorrectOption] = useState(null);
    const [trueFalseAnswer, setTrueFalseAnswer] = useState(null);

    const resetForm = () => {
        setQuestionText('');
        setOptions(['', '', '', '']);
        setCorrectOption(null);
        setTrueFalseAnswer(null);
        setQuestionType('');
    };

    const handleSaveQuestion = () => {
        const newQuestion = {
            type: questionType,
            question: questionText,
            ...(questionType === 'mcq' && { options, correctOption }),
            ...(questionType === 'true-false' && { correctAnswer: trueFalseAnswer }),
        };

        setQuestions([...questions, newQuestion]);
        setShowPopup(false);
        resetForm();
    };

    const isFormValid = () => {
        if (!questionText) return false;

        if (questionType === 'mcq') {
            return options.every((opt) => opt.trim() !== '') && correctOption !== null;
        }

        if (questionType === 'true-false') {
            return trueFalseAnswer !== null;
        }

        if (questionType === 'type-answer') {
            return questionText.trim() !== '';
        }

        return false;
    };

    const quizDetails = JSON.parse(localStorage.getItem('quizDetails')) || {
        department: "ISE",
        batch: "21",
        section: "D",
        testID: "AEO8SGA0SP",
        testName: "hh",
        timer: 10
    };

    const handleCreateQuiz = async () => {
        const quizData = {
            quizDetails: quizDetails,
            questions: JSON.stringify(questions),
        };
        try {
            const response = await fetch('http://127.0.0.1:5000/teacher/createquiz', {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quizData),
            });

            if (response.ok) {
                alert('Quiz created successfully!');
                navigate('/teacher/dashboard');
            } else {
                const errorData = await response.json();
                console.log("Error Data:", errorData);
                alert(`Failed to create quiz: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error creating quiz:', error);
            alert('An error occurred while creating the quiz.');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 flex">
            {/* Left Section: Quiz Details Profile Card */}
            <div className="w-1/3 bg-gray-800 p-6 rounded-lg shadow-lg mr-6">
                <div className="text-center mb-4">
                    <h1 className="text-3xl font-semibold text-green-400 mb-2">{testName}</h1>
                    <p className="text-lg text-gray-300">Quiz Profile</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-medium text-gray-300">Department:</span>
                        <span className="text-lg text-gray-400">{quizDetails.department}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-medium text-gray-300">Batch:</span>
                        <span className="text-lg text-gray-400">{quizDetails.batch}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-medium text-gray-300">Section:</span>
                        <span className="text-lg text-gray-400">{quizDetails.section}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-medium text-gray-300">Quiz ID:</span>
                        <span className="text-lg text-gray-400">{testID}</span>
                    </div>
                </div>
                <button
                    onClick={handleCreateQuiz}
                    className="w-full bg-blue-600 text-white text-lg py-2 rounded-md hover:bg-blue-700 mt-4 flex items-center justify-center gap-2"
                >
                    <FaCheck /> Create Quiz
                </button>
            </div>

            {/* Right Section: Add Question and Created Questions */}
            <div className="w-2/3 space-y-6">
                {/* Button to Add Question at the Top Middle */}
                <button
                    onClick={() => setShowPopup(true)}
                    className="w-1/2 bg-green-600 py-2 rounded-md hover:bg-green-700 text-lg flex items-center justify-center gap-2 mx-auto"
                >
                    <FaPlus /> Add Question
                </button>

                {/* Display Created Questions */}
                {questions.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <h2 className="text-lg font-semibold text-gray-300">Created Questions:</h2>
                        <ul className="space-y-2">
                            {questions.map((q, index) => (
                                <li key={index} className="p-2 border rounded-md bg-gray-800">
                                    <strong>{q.type.toUpperCase()}:</strong> {q.question}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Popup for Adding Question */}
                {showPopup && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
                        <div className="bg-gray-800 text-white rounded-lg p-6 w-full max-w-lg space-y-4">
                            <h2 className="text-lg font-semibold">Add a Question</h2>

                            {/* Question Type Selection */}
                            <div>
                                <label className="font-medium">Select Question Type:</label>
                                <select
                                    value={questionType}
                                    onChange={(e) => setQuestionType(e.target.value)}
                                    className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                >
                                    <option value="">Select Type</option>
                                    <option value="mcq">Multiple Choice</option>
                                    <option value="true-false">True/False</option>
                                    <option value="type-answer">Type Answer</option>
                                </select>
                            </div>

                            {/* Question Input */}
                            {questionType && (
                                <div>
                                    <label className="font-medium">Question:</label>
                                    <input
                                        type="text"
                                        value={questionText}
                                        onChange={(e) => setQuestionText(e.target.value)}
                                        placeholder="Enter the question"
                                        className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                    />
                                </div>
                            )}

                            {/* Multiple Choice Options */}
                            {questionType === 'mcq' && (
                                <div className="space-y-2">
                                    <h3 className="font-medium">Options:</h3>
                                    {options.map((option, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) =>
                                                    setOptions((prev) =>
                                                        prev.map((opt, i) => (i === index ? e.target.value : opt))
                                                    )
                                                }
                                                placeholder={`Option ${index + 1}`}
                                                className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                            />
                                            <input
                                                type="radio"
                                                name="correctOption"
                                                checked={correctOption === index}
                                                onChange={() => setCorrectOption(index)}
                                                className="h-5 w-5"
                                            />
                                            <label>Correct</label>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* True/False Answer Selection */}
                            {questionType === 'true-false' && (
                                <div className="space-y-2">
                                    <h3 className="font-medium">Select Correct Answer:</h3>
                                    <div className="flex items-center space-x-4">
                                        <label>
                                            <input
                                                type="radio"
                                                name="trueFalse"
                                                value="true"
                                                checked={trueFalseAnswer === true}
                                                onChange={() => setTrueFalseAnswer(true)}
                                                className="h-5 w-5"
                                            />
                                            True
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="trueFalse"
                                                value="false"
                                                checked={trueFalseAnswer === false}
                                                onChange={() => setTrueFalseAnswer(false)}
                                                className="h-5 w-5"
                                            />
                                            False
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Type Answer Instructions */}
                            {questionType === 'type-answer' && (
                                <p className="text-sm text-gray-500">Simply enter the question above.</p>
                            )}

                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => {
                                        setShowPopup(false);
                                        resetForm();
                                    }}
                                    className="bg-gray-700 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-600 flex items-center gap-2"
                                >
                                    <FaTimes /> Cancel
                                </button>
                                {isFormValid() && (
                                    <button
                                        onClick={handleSaveQuestion}
                                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
                                    >
                                        <FaSave /> Save
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateQuestions;
