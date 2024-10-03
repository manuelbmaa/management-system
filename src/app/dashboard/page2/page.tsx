"use client";

import { useRouter } from 'next/navigation';

export default function Page2() {
  const router = useRouter();

  return (
    <div>
      <h1 className="text-3xl font-bold">Edit Project</h1>
      <button onClick={() => router.push('/dashboard')} className="btn btn-secondary mt-4">
        Back to Dashboard
      </button>
    </div>
  );
}