import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../utils/api";

function TeacherSignUp() {
  const { signUp, isLoaded } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (window.Clerk) {
        await window.Clerk.session?.reload();
        await window.Clerk.client?.destroy();
      }

      if (!isLoaded) throw new Error("Clerk not ready");

      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerificationSent(true);
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage(
        error.message.includes("taken")
          ? "Email already in use. Please log in or use a different email."
          : "Failed to start signup. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const verification = await signUp.attemptEmailAddressVerification({ code: otp });
      if (verification.status !== 'complete') throw new Error("Invalid OTP");

      const { data } = await fetchData("/signup/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Sign-up successful", data);
      alert("Sign-up successful! Please log in.");
      navigate("/teacher/login");
    } catch (error) {
      console.error("Error during sign-up:", error);
      setErrorMessage(error.message.includes("Invalid") ? "Invalid verification code" : "Sign-up failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-900 min-h-screen flex items-center justify-center py-12">
      <div className="max-w-lg w-full bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-green-400 mb-6">Teacher Sign Up</h2>
        <form onSubmit={verificationSent ? handleVerifyOtp : handleSignUp}>
          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={verificationSent}
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={verificationSent}
            />
          </div>

          {/* OTP Input */}
          {verificationSent && (
            <div className="mb-6">
              <label htmlFor="otp" className="block text-gray-300 mb-2">Enter OTP</label>
              <input
                type="text"
                id="otp"
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300"
            disabled={loading}
          >
            {loading ? (verificationSent ? "Verifying OTP..." : "Signing up...") : (verificationSent ? "Verify OTP" : "Sign Up")}
          </button>

          {/* Error Message */}
          {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}

          {/* Redirect to Login */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button onClick={() => navigate('/teacher/login')} className="text-green-400 font-semibold hover:underline">
                Sign in here
              </button>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default TeacherSignUp;
