// app/activate-account/[uid]/[token]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ActivateAccountPage() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const res = await fetch('http://localhost:8000/auth/users/activation/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid, token }),
        });

        if (res.ok) {
          setStatus('success');
        } else {
          const data = await res.json();
          setErrorMsg(data?.detail || 'Activation failed.');
          setStatus('error');
        }
      } catch (error: any) {
        setErrorMsg(error.message || 'Something went wrong.');
        setStatus('error');
      }
    };

    if (uid && token) activateAccount();
  }, [uid, token]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {status === 'loading' && <p className="text-lg">Activating your account...</p>}
      {status === 'success' && (
        <div className="text-green-600 text-xl font-semibold">
          ✅ Account activated successfully!
        </div>
      )}
      {status === 'error' && (
        <div className="text-red-600">
          ❌ Account activation failed: {errorMsg}
        </div>
      )}
    </div>
  );
}
