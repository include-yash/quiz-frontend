import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router for navigation

const CreateTest = () => {
    const [testName, setTestName] = useState('');
    const [testID] = useState(Math.random().toString(36).substring(2, 12).toUpperCase());
    const [department, setDepartment] = useState('');
    const [batch, setBatch] = useState(''); // Batch input
    const [section, setSection] = useState('');
    const [timer, setTimer] = useState(0); // Timer state to store the time in minutes

    const navigate = useNavigate();

    const handleNavigate = () => {
        if (!testName || !department || !batch || !section || timer === 0) {
            alert("Please fill in all fields before proceeding.");
            return;
        }

        // Save quiz details to localStorage
        const quizDetails = { testName, testID, department, batch, section, timer };
        localStorage.setItem('quizDetails', JSON.stringify(quizDetails));

        // Navigate to the Create Questions page with state
        navigate('/teacher/create-questions', {
            state: { testName, testID, department, batch, section, timer },
        });
    };

    // Functions to increment timer by specific values
    const addTime = (minutes) => {
        setTimer((prevTime) => prevTime + minutes);
    };

    // Function to reset the timer
    const resetTimer = () => {
        setTimer(0);
    };

    // Batch input validation
    const handleBatchChange = (e) => {
        const value = e.target.value;
        if (value >= 21 && value <= 29) {
            setBatch(value);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-6 flex justify-center items-center">
            <div className="w-full max-w-7xl bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col lg:flex-row gap-6">
                {/* Left Section: Form Inputs */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <div className="flex flex-col space-y-4">
                        <label className="text-lg font-medium text-white">Quiz Name:</label>
                        <input
                            type="text"
                            placeholder="Enter Quiz Name"
                            value={testName}
                            onChange={(e) => setTestName(e.target.value)}
                            className="p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-gray-500"
                        />
                    </div>

                    <div className="flex flex-col space-y-4">
                        <label className="text-lg font-medium text-white">Department:</label>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-white"
                        >
                            <option value="">Select Department</option>
                            <option value="is">ISE</option>
                            <option value="CS">CSE</option>
                            <option value="EC">ECE</option>
                            <option value="AI">AIML</option>
                        </select>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <label className="text-lg font-medium text-white">Batch (between 21 and 29):</label>
                        <input
                            type="number"
                            value={batch}
                            onChange={handleBatchChange}
                            min="21"
                            max="29"
                            className="p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-white"
                        />
                        {batch && (batch < 21 || batch > 29) && (
                            <p className="text-red-500 text-sm">Batch should be between 21 and 29.</p>
                        )}
                    </div>

                    <div className="flex flex-col space-y-4">
                        <label className="text-lg font-medium text-white">Section:</label>
                        <select
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            className="p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-white"
                        >
                            <option value="">Select Section</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                        </select>
                    </div>
                </div>

                {/* Right Section: Timer Controls and Actions */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <div className="flex flex-col space-y-4">
                        <label className="text-lg font-medium text-white">Timer (in minutes):</label>
                        <div className="flex items-center gap-6">
                            <input
                                type="number"
                                value={timer}
                                readOnly
                                className="p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-white"
                            />
                            <div className="flex gap-4">
                                <button
                                    onClick={() => addTime(10)}
                                    className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-400 transition"
                                >
                                    +10 min
                                </button>
                                <button
                                    onClick={() => addTime(15)}
                                    className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-400 transition"
                                >
                                    +15 min
                                </button>
                                <button
                                    onClick={() => addTime(30)}
                                    className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-400 transition"
                                >
                                    +30 min
                                </button>
                                <button
                                    onClick={() => addTime(60)}
                                    className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-400 transition"
                                >
                                    +60 min
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={resetTimer}
                            className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-400 transition"
                        >
                            Reset Timer
                        </button>
                    </div>

                    <p className="text-lg text-white font-semibold">
                        <strong>Quiz ID:</strong> {testID}
                    </p>

                    <button
                        onClick={handleNavigate}
                        className="mt-6 w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-400 transition"
                    >
                        Go to Create Questions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTest;
