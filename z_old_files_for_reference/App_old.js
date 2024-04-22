import './App.css';
import DisplayQuestion from './components/DisplayQuestion';
import DisplayScore from './components/DisplayScore';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ExamCompleted from './components/ExamCompleted';
import Register from './components/Register';
import Login from './components/Login';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { candidateIdStore } from './store/slices/CandidateIdSlice';

function App() {

  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const candidateTime = useSelector((state) => state.candidateTime.value);

  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  // const [candidateId, setCandidateId] = useState();
  axios.defaults.withCredentials = true;

  const candidateId = useSelector((state) => state.candidateId.value);

  useEffect(() => {
    axios.get('http://localhost:5000/')
    .then((res) => {
        if(res.data.Status === "Success") {
            setAuth(true);
            // setCandidateId(res.data.candidate_id);
            dispatch(candidateIdStore(res.data.candidate_id));
        } else {
            setAuth(false);
            setMessage(res.data.Error);
            // navigate('/login');
        }
    })
  }, []);

  return (
    <div className="App">
      <h2>{candidateId}</h2>
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={<Register/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/' element={auth ? (
            (candidateTime > 0) ? (
              <DisplayQuestion />
            ) : (
              <ExamCompleted />
            )
          ) : (
            <Navigate to='/login' />
          )} />
          {auth && (
            <>
              <Route path='/examCompleted' element={<ExamCompleted />} />
              <Route path='/score' element={<DisplayScore />} />
            </>
          )}
        </Routes>
      </BrowserRouter>    
    </div>
  );
}

export default App;
