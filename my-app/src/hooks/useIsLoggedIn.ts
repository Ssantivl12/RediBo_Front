import { useEffect, useState } from 'react';

export default function useIsLoggedIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLogin();

    window.addEventListener('authChange', checkLogin);
    window.addEventListener('storage', checkLogin);

    return () => {
      window.removeEventListener('authChange', checkLogin);
      window.removeEventListener('storage', checkLogin);
    };
  }, []);

  return isLoggedIn;
}
