import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { usePuterStore } from '~/lib/puter';

export const meta: () => { title: string; description: string }[] = () => [
  { title: "Resumind | Auth", description: "Log into your account" },
];

const Auth = () => {
  const { auth, isLoading } = usePuterStore();
  const location = useLocation();
  const next = location.search.split('next=')[1];
  const navigate = useNavigate();

  useEffect(() => {
    if(auth.isAuthenticated) navigate(next);

  }, [auth.isAuthenticated, next])


  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover mon-h-screen flex items-center">
      <div className='gradient-border shadow-lg'>
        <section className='flex flex-col gap-8 bg-white rounded-2xl p-10'>
          <div className='flex flex-col items-center gap-2 text-center'>
            <h1>Welcome to Resumind</h1>
            <h2>Log in to your account</h2>
          </div>

          <div>
            {isLoading ? (
              <button className='auth-button animate-pulse cursor-pointer'>
                <p>Signing in...</p>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button className='auth-button cursor-pointer' onClick={auth.signOut}>
                    <p>Log Out</p>
                  </button>
                ): (
                  <button className='auth-button cursor-pointer' onClick={auth.signIn}>
                    <p>Log In</p>
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Auth
