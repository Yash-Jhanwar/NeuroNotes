export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm text-center">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-6 drop-shadow-sm">
          Welcome to the Study Portal
        </h1>
        <p className="text-xl text-gray-600 mb-4 font-semibold">
          Your Next.js Frontend is Running! 🚀
        </p>
        <p className="text-md max-w-lg mx-auto text-gray-500">
          Please click &quot;Sign In&quot; or &quot;Sign Up&quot; above to continue. Once you login, we will connect your profile to our Express backend.
        </p>
      </div>
    </main>
  );
}
