import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../context/auth';

const useRequireAuth = () => {
  const { isLoggedIn } = useAuth();
  const { push } = useRouter();

  useEffect(() => {
    if (isLoggedIn === false) {
      push('/signin');
    }
  }, [isLoggedIn, push]);

  return isLoggedIn;
};

export default useRequireAuth;