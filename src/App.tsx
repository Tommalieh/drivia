import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TheoryList from './pages/TheoryList';
import ChapterPage from './pages/ChapterPage';
import QuizSimulatorPage from './pages/QuizSimulatorPage';
import QuizPage from './pages/QuizPage';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to /home */}
        <Route path='/' element={<Navigate to='/home' replace />} />

        {/* Routes using the dashboard layout */}
        <Route element={<DashboardLayout />}>
          <Route path='/home' element={<Home />} />
          <Route path='/theory' element={<TheoryList />} />
          <Route path='/theory/:chapterId' element={<ChapterPage />} />
          <Route path='/quiz-simulator' element={<QuizSimulatorPage />} /> {/* NEW */}
          <Route path='/quiz/:quizSessionId' element={<QuizPage />} /> {/* NEW */}
        </Route>

        {/* Auth routes - no layout */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Fallback */}
        <Route path='*' element={<Navigate to='/home' replace />} />
      </Routes>
    </Router>
  );
}

export default App;
