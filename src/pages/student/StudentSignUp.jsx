import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../utils/api.js"; // API utility function

function StudentSignUp() {
  const { signUp, isLoaded } = useSignUp();
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [usn, setUsn] = useState(""); // New state for USN
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // State for OTP input
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false); // Track OTP sent status
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // 1. Force reset Clerk's local state
      if (window.Clerk) {
        await window.Clerk.session?.reload();
        await window.Clerk.client?.destroy();
      }
  
      // 2. Re-initialize signup
      if (!isLoaded) throw new Error("Clerk not ready");
      
      const result = await signUp.create({
        emailAddress: email,
        password,
      });
  
      // 3. Send OTP
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
      // 1. Verify OTP with Clerk
      const verification = await signUp.attemptEmailAddressVerification({ code: otp });
      if (verification.status !== 'complete') throw new Error("Invalid OTP");
  
      // 2. Call backend using fetchData with USN included
      const { data, status } = await fetchData("/signup/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          section, 
          department, 
          usn, // Include USN in the request
          password 
        }),
      });
  
      // 3. Complete Clerk signup
      navigate("/student/login");
  
    } catch (error) {
      console.error("Registration Error:", error);
      setErrorMessage(
        error.message.includes("Invalid") ? "Invalid verification code" :
        error.message.includes("failed") ? "Account created but confirmation pending" :
        "Registration completed successfully! Please login."
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <section className="h-screen bg-black flex justify-center items-center py-12">
      <div className="max-w-lg w-full bg-gray-900 p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Student Sign Up</h2>
        <form onSubmit={verificationSent ? handleVerifyOtp : handleSignUp}>
          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={verificationSent}
            />
          </div>

          {/* USN Input */}
          <div className="mb-6">
            <label htmlFor="usn" className="block text-gray-300 mb-2">USN (University Seat Number)</label>
            <input
              type="text"
              id="usn"
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
              required
              disabled={verificationSent}
              pattern="[0-9][A-Za-z]{2}[0-9]{2}[A-Za-z]{2}[0-9]{3}" // Basic USN pattern validation
              title="Please enter a valid USN (e.g., 1DS21CS001)"
              placeholder="e.g., 1DS21CS001"
            />
          </div>

          {/* Department Input */}
          <div className="mb-6">
            <label htmlFor="department" className="block text-gray-300 mb-2">Department</label>
            <input
              type="text"
              id="department"
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              disabled={verificationSent}
            />
          </div>

          {/* Section Dropdown */}
          <div className="mb-6">
            <label htmlFor="section" className="block text-gray-300 mb-2">Section</label>
            <select
              id="section"
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
              disabled={verificationSent}
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? (verificationSent ? "Verifying OTP..." : "Signing up...") : (verificationSent ? "Verify OTP" : "Sign Up")}
          </button>

          {/* Error Message */}
          {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}

          {/* Redirect to Login */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/student/login")}
                className="text-blue-500 font-semibold hover:underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default StudentSignUp;