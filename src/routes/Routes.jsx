import { Route, Routes } from 'react-router-dom';
import SuccessPage from '../pages/student/SuccessPage';
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
import TakeTest from '../pages/student/TakeTest';
import Leaderboard from '../pages/student/Leaderboard';
import Leader from '../pages/teacher/Leader';
import Profile from '../pages/teacher/Profile';
import Settings from '../pages/teacher/Settings';
import ProtectedTeacherRoute from '../context/ProtectedTeacherRoute'
import ProtectedStudentRoute from '../context/ProtectedStudentRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/signup" element={<StudentSignUp />} />

      
       {/* Protected Routes for Students */}
       <Route path="/student/dashboard" element={<ProtectedStudentRoute element={<StudentDashboard />} />} />
      <Route path="/student/take-test" element={<ProtectedStudentRoute element={<TakeTest />} />} />
      <Route path="/student/leaderboard/:testId" element={<ProtectedStudentRoute element={<Leaderboard />} />} />
      <Route path="/student/success" element={<ProtectedStudentRoute element={<SuccessPage />} />} />

      <Route path="/teacher/login" element={<TeacherLogin />} />
      <Route path="/teacher/signup" element={<TeacherSignUp />} />

      {/* Wrap teacher-specific routes with ProtectedTeacherRoute */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedTeacherRoute>
            <TeacherDashboard />
          </ProtectedTeacherRoute>
        }
      />
      <Route
        path="/teacher/create-test"
        element={
          <ProtectedTeacherRoute>
            <CreateTest />
          </ProtectedTeacherRoute>
        }
      />
      <Route
        path="/teacher/view-tests"
        element={
          <ProtectedTeacherRoute>
            <ViewTests />
          </ProtectedTeacherRoute>
        }
      />
      <Route
        path="/teacher/create-questions"
        element={
          <ProtectedTeacherRoute>
            <CreateQuestions />
          </ProtectedTeacherRoute>
        }
      />
      <Route
        path="/teacher/leaderboard/:testId"
        element={
          <ProtectedTeacherRoute>
            <Leader />
          </ProtectedTeacherRoute>
        }
      />
      <Route
        path="/teacher/tab-switch/:quizId"
        element={
          <ProtectedTeacherRoute>
            <TabSwitch />
          </ProtectedTeacherRoute>
        }
      />
      <Route
        path="/teacher/profile"
        element={
          <ProtectedTeacherRoute>
            <Profile />
          </ProtectedTeacherRoute>
        }
      />
      <Route
        path="/teacher/settings"
        element={
          <ProtectedTeacherRoute>
            <Settings />
          </ProtectedTeacherRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
