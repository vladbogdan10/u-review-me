import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import saveCurrentUrlToSessionStorage from '../utils/saveCurrentUrlToSessionStorage';

function useAuthorized() {
  const { data: session } = useSession();
  const router = useRouter();

  const isAuthorized = (cb: () => void) => {
    if (!session) {
      saveCurrentUrlToSessionStorage();
      router.push('/auth/signup');

      return;
    }

    if (session.user.newUser || session.user.newUser === undefined) {
      router.push('/auth/new-user');

      return;
    }

    cb();
  };

  return [isAuthorized];
}

export default useAuthorized;
