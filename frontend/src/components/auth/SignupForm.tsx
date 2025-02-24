export function SignupForm({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[400px] p-8 rounded-lg border border-gray-300/30 
                      bg-white/10 backdrop-blur-md shadow-lg shadow-green-500/20">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Sign Up</h2>

        {/* Signup Form Fields (You can customize this) */}
        <p className="text-gray-400 text-center">This is a placeholder for the signup form.</p>

        {/* Back to Login */}
        <button
          onClick={onBack}
          className="mt-6 block w-full text-center text-blue-400 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  )
}

