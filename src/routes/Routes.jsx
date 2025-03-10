import { Route, Routes } from 'react-router-dom';
import SuccessPage from '../pages/student/SuccessPage';  // Import SuccessPage

import HomePage from '../pages/HomePage';
import StudentLogin from '../pages/student/StudentLogin';
import TeacherLogin from '../pages/teacher/TeacherLogin';
import StudentSignUp from '../pages/student/StudentSignUp';
import TeacherSignUp from '../pages/teacher/TeacherSignUp';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import CreateTest from '../pages/teacher/CreateTest';
import ViewTests from '../pages/teacher/ViewTests';
import CreateQuestions from '../pages/teacher/CreateQuestions';
import TabSwitch from '../pages/teacher/TabSwitch';
import StudentDashboard from '../pages/student/StudentDashboard';
import TakeTest from '../pages/student/TakeTest';  // Import the new TakeTest page
import Leaderboard from '../pages/student/Leaderboard'; // Import Leaderboard page (New Route)
import Leader from '../pages/teacher/Leader'; // Import Leader page (New Route)
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/signup" element={<StudentSignUp />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/take-test" element={<TakeTest />} /> {/* Add TakeTest route */}
      <Route path="/student/success" element={<SuccessPage />} />  {/* Add SuccessPage route */}
      <Route path="/student/leaderboard/:testId" element={<Leaderboard />} /> {/* New Leaderboard Route */}

      <Route path="/teacher/login" element={<TeacherLogin />} />
      <Route path="/teacher/signup" element={<TeacherSignUp />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/teacher/create-test" element={<CreateTest />} />
      <Route path="/teacher/view-tests" element={<ViewTests />} />
      <Route path="/teacher/create-questions" element={<CreateQuestions />} />
      <Route path="/teacher/leaderboard/:testId" element={<Leader />} />
      <Route path="/teacher/tab-switch/:quizId" element={<TabSwitch />} />
    </Routes>
  );
};

export default AppRoutes;
