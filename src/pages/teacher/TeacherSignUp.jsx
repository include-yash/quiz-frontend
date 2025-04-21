"use client"
import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../utils/api.js";
import { useToast } from "../../components/ui/toast";
import { validatePassword, validateEmail } from "../../utils/validation.js";
import { PasswordRequirements } from "../../components/ui/PasswordRequirements.jsx";

function TeacherSignUp() {
  const { signUp, isLoaded } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
        addToast("Authentication service not ready. Please try again shortly.", { 
          type: "error",
          duration: 5000
        });
        throw new Error("Clerk not ready");
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
      addToast("Verification email sent! Please check your inbox.", { 
        type: "success",
        duration: 6000
      });
    } catch (error) {
      console.error("Signup error:", error);
      const errorMsg = error.message.includes("taken")
        ? "Email already in use. Please log in or use a different email."
        : "Failed to start signup. Please try again.";
      
      addToast(errorMsg, { 
        type: "error",
        duration: 6000
      });
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
        addToast("Please enter a valid 6-digit OTP", { 
          type: "error",
          duration: 5000
        });
        setLoading(false);
        return;
      }
  
      const verification = await signUp.attemptEmailAddressVerification({ code: otp });
      if (verification.status !== 'complete') {
        addToast("Invalid OTP. Please check the code and try again.", { 
          type: "error",
          duration: 5000
        });
        throw new Error("Invalid OTP");
      }
  
      const data = await fetchData("/signup/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (data.error) {
        addToast(data.error || "Registration failed. Please try again.", { 
          type: "error",
          duration: 6000
        });
        throw new Error(data.error);
      }
  
      addToast("Registration successful! Redirecting to login...", { 
        type: "success",
        duration: 4000
      });
      setTimeout(() => navigate("/teacher/login"), 3000);
    } catch (error) {
      console.error("Registration Error:", error);
      const errorMsg = error.message.includes("network") 
        ? "Network error. Please check your connection."
        : error.message || "Registration failed. Please try again.";
      
      addToast(errorMsg, { 
        type: "error",
        duration: 6000
      });
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen bg-black flex justify-center items-center py-12">
      <div className="max-w-lg w-full bg-gray-900 p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Teacher Sign Up</h2>
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
              placeholder="firstname.dept@bmsce.ac.in"
            />
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
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2" 
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

          {errorMessage && (
            <p className="text-red-500 text-center mt-4" aria-live="assertive">
              {errorMessage}
            </p>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <a href="/teacher/login" className="text-blue-500 hover:underline">
                Sign in here
              </a>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default TeacherSignUp;
