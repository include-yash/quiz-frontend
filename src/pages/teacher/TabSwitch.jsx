import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../../utils/api';

const TabSwitch = () => {
  const { quizId } = useParams();
  const [tabSwitchEvents, setTabSwitchEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTabSwitchEvents = async () => {
      try {
        const data = await fetchData(`/teacher/tab-switch/${quizId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('student_token')}`,
          }
        });
  
        console.log("Raw Response:", data); // Debugging
  
        if (data && data.tab_switch_events) {
          setTabSwitchEvents(data.tab_switch_events);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(err.message);
      }
    };
  
    fetchTabSwitchEvents();
  }, [quizId]);
   // Fetch new data when quizId changes

  if (error) {
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-200 mb-6">
          Tab Switch Events
        </h2>

        {tabSwitchEvents.length === 0 ? (
          <p className="text-center text-lg text-gray-400">No tab switch events found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-700 border border-gray-600 rounded-lg shadow-md">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-200">Student ID</th>
                  <th className="px-6 py-3 text-left text-gray-200">Student Name</th>
                  <th className="px-6 py-3 text-left text-gray-200">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {tabSwitchEvents.map(event => (
                  <tr key={event.id} className="border-t hover:bg-gray-600 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-300">{event.student_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{event.student_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabSwitch;
