import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';

// Сделать селектор для имени пользователя
export const AppHeader: FC = () => {
  const name = useSelector((state) => state.auth.data.name);
  return <AppHeaderUI userName={name} />;
};
