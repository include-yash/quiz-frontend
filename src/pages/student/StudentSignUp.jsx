"use client";
import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../utils/api.js";
import { useToast } from "../../components/ui/toast";
import { validatePassword, validateEmail, validateUSN } from "../../utils/validation.js";
import { PasswordRequirements } from "../../components/ui/PasswordRequirements.jsx";

function StudentSignUp() {
  const { signUp, isLoaded } = useSignUp();
  const [email, setEmail] = useState("");
  const [section, setSection] = useState("");
  const [usn, setUsn] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDiploma, setIsDiploma] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      if (window.Clerk) {
        await window.Clerk.session?.reload();
        await window.Clerk.client?.destroy();
      }

      if (!isLoaded) {
        addToast("Authentication service not ready. Please try again shortly.", { type: "error" });
        throw new Error("Clerk not ready");
      }

      if (!validateEmail(email)) {
        addToast("Invalid email format. Use: firstname.deptYY@bmsce.ac.in (e.g., rahul.cs23@bmsce.ac.in)", { 
          type: "error",
          duration: 8000
        });
        setLoading(false);
        return;
      }
      
      if (!validateUSN(usn)) {
        addToast("Invalid USN format. Must be: 1BMYYXXNNN (e.g., 1BM23CS123)", {
          type: "error",
          duration: 8000
        });
        setLoading(false);
        return;
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        const missing = [];
        if (!passwordValidation.requirements.minLength) missing.push("8+ characters");
        if (!passwordValidation.requirements.hasUpperCase) missing.push("uppercase letter");
        if (!passwordValidation.requirements.hasLowerCase) missing.push("lowercase letter");
        if (!passwordValidation.requirements.hasNumber) missing.push("number");
        if (!passwordValidation.requirements.hasSpecialChar) missing.push("special character");
        
        addToast(`Password needs: ${missing.join(", ")}`, { 
          type: "error",
          duration: 8000
        });
        setLoading(false);
        return;
      }

      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerificationSent(true);
      addToast("Verification email sent! Please check your inbox.", { type: "success" });
    } catch (error) {
      console.error("Signup error:", error);
      const errorMsg = error.message.includes("taken")
        ? "Email already in use. Please log in or use a different email."
        : "Failed to start signup. Please try again.";
      
      addToast(errorMsg, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
  
    try {
      if (!otp || otp.length < 6) {
        addToast("Please enter a valid 6-digit OTP", { type: "error" });
        setLoading(false);
        return;
      }
  
      const verification = await signUp.attemptEmailAddressVerification({ code: otp });
      if (verification.status !== 'complete') {
        addToast("Invalid OTP. Please check the code and try again.", { type: "error" });
        throw new Error("Invalid OTP");
      }
  
      // Remove the response.json() call since fetchData already parses it
      const data = await fetchData("/signup/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, section, usn, password, isDiploma }),
      });
  
      // Check for error in the returned data
      if (data.error) {
        addToast(data.error || "Registration failed. Please try again.", { type: "error" });
        throw new Error(data.error);
      }
  
      addToast("Registration successful! Redirecting to login...", { type: "success" });
      setTimeout(() => navigate("/student/login"), 3000);
    } catch (error) {
      console.error("Registration Error:", error);
      const errorMsg = error.message.includes("network") 
        ? "Network error. Please check your connection."
        : error.message || "Registration failed. Please try again.";
      
      addToast(errorMsg, { type: "error" });
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-black flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Student Sign Up</h2>
        <form onSubmit={verificationSent ? handleVerifyOtp : handleSignUp}>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Email</label>
            <input 
              type="email" 
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={verificationSent} 
              placeholder="firstname.deptYY@bmsce.ac.in"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">USN</label>
            <input 
              type="text" 
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md" 
              value={usn} 
              onChange={(e) => setUsn(e.target.value)} 
              required 
              disabled={verificationSent} 
              placeholder="e.g., 1BM23CS123"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Section</label>
            <select 
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md" 
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
          <div className="mb-6 flex items-center">
            <input 
              type="checkbox" 
              id="diploma" 
              checked={isDiploma} 
              onChange={() => setIsDiploma(!isDiploma)} 
              className="mr-2" 
            />
            <label htmlFor="diploma" className="text-gray-300">Click if you are a Diploma student</label>
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={verificationSent} 
            />
            <PasswordRequirements password={password} />
          </div>
          {verificationSent && (
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Enter OTP</label>
              <input 
                type="text" 
                className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
                minLength="6"
                maxLength="6"
                placeholder="6-digit code"
              />
            </div>
          )}
          <button 
            type="submit" 
            className="w-full py-3 bg-purple-800 text-white font-semibold rounded-md hover:bg-purple-700 transition duration-300 flex items-center justify-center gap-2" 
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {verificationSent ? "Verifying..." : "Processing..."}
              </>
            ) : verificationSent ? "Verify OTP" : "Sign Up"}
          </button>
          {errorMessage && <div className="text-red-500 mt-4 text-center">{errorMessage}</div>}
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <a href="/student/login" className="text-purple-500 hover:underline">Sign in</a>
        </p>
      </div>
    </section>
  );
}

export default StudentSignUp;
