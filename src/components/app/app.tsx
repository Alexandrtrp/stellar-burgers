import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  Navigate,
  Route,
  Router,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeedsThunk, getIngredientsThunk } from '../../services/burgerSlice';
import { getUserThunk } from '../../services/authSlice';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  if (
    (location.pathname === '/login' || location.pathname === '/register') &&
    isAuthenticated
  ) {
    return <Navigate to='/profile' />;
  } else if (
    (location.pathname === '/login' ||
      location.pathname === '/register' ||
      location.pathname === '/forgot-password' ||
      location.pathname === '/reset-password') &&
    !isAuthenticated
  )
    return <>{children}</>;

  return isAuthenticated ? <>{children}</> : <Navigate to='/login' />;
};

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getIngredientsThunk());
    dispatch(getFeedsThunk());
    dispatch(getUserThunk());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* Защищённые маршруты */}
        <Route
          path='/login'
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* Страница 404 */}
        <Route path='*' element={<NotFound404 />} />

        {/* Модалки  */}
        <Route
          path='/feed/:number'
          element={
            <Modal title={'Заказ'} onClose={(): void => navigate(-1)}>
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal title={'Ингредиент'} onClose={(): void => navigate(-1)}>
              <IngredientDetails />
            </Modal>
          }
        />
        {/* Защищенная модалка */}
        <Route
          path='/profile/orders/:number'
          element={
            <Modal title={'Мой заказ'} onClose={(): void => navigate(-1)}>
              <OrderInfo />
            </Modal>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
