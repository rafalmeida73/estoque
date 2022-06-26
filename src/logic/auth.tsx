import { NextComponentType } from 'next';
import { useSession } from 'next-auth/react';
import Loading from '../components/Loading';

function withAuth<T>(Component: NextComponentType<T>) {
  const Auth = (props: T) => {
    const { data: session } = useSession();

    if (!session) {
      return <Loading />;
    }

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
}

export default withAuth;
