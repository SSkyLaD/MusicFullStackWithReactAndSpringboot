// useResetAndNavigate.js (hoặc useResetAndNavigate.ts nếu dùng TypeScript)
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import userSlice from '../pages/UserPage/userSlice';

const useResetAndNavigate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resetAndNavigate = () => {
    dispatch(userSlice.actions.resetState());
    navigate("/login");
  };

  return resetAndNavigate;
};

export default useResetAndNavigate;
