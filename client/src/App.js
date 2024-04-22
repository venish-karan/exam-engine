import { Routes, Route } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import DisplayQuestion from './components/DisplayQuestion';
import ExamCompleted from './components/ExamCompleted';
import FeedBack from './components/FeedBack';
import QuestionBuilder from './components/QuestionBuilder';
import QuestionsXlsx from './components/QuestionsXlsx';
import Unauthorized from './components/Unauthorized';
import Missing from './components/Missing';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
// import Users from './components/Users';

// If javasceript is viewable by the public, just use the code in the value not the key of the object
const ROLES = {
  'Admin': 111,
  'Candidate': 222,
  'Editor': 333,
}

function App() {

    return (
      <div className='App'>
        <Routes>
            {/* public routes */}
            <Route path='register' element={<Register/>} />
            <Route path='login' element={<Login/>} />
            <Route path='unauthorized' element={<Unauthorized />} />
            {/* <Route path='users' element={<Users />} /> */}

            {/* We want to protect these routes */}
            <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Candidate]} />}>
              {/* <Route path='questionBuilder' element={<QuestionBuilder />} /> */}
              <Route path='questionBuilder' element={<QuestionsXlsx />} />
            </Route>
            
            <Route path='/' element={<Layout />}>
              <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Candidate]} />}>
                <Route path='/' element={<DisplayQuestion />} />
                <Route path='examCompleted' element={<ExamCompleted />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Candidate]} />}>
                <Route path='feedback' element={<FeedBack />} />
              </Route>
            </Route>
            {/* Catch all */}
            <Route path='*' element={<Missing />} />
        </Routes>
      </div>    
    );
  }
  
  export default App;