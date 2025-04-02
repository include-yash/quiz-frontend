import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../utils/api.js"; // API utility function

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

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (window.Clerk) {
        await window.Clerk.session?.reload();
        await window.Clerk.client?.destroy();
      }

      if (!isLoaded) throw new Error("Clerk not ready");
      
      await signUp.create({ emailAddress: email, password });
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

      await fetchData("/signup/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, section, usn, password, isDiploma }),
      });

      navigate("/student/login");
    } catch (error) {
      console.error("Registration Error:", error);
      setErrorMessage("Invalid verification code or registration error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen bg-black flex justify-center items-center py-12">
      <div className="max-w-lg w-full bg-gray-900 p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Student Sign Up</h2>
        <form onSubmit={verificationSent ? handleVerifyOtp : handleSignUp}>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Email</label>
            <input type="email" className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={verificationSent} />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">USN</label>
            <input type="text" className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md" value={usn} onChange={(e) => setUsn(e.target.value)} required disabled={verificationSent} />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Section</label>
            <select className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md" value={section} onChange={(e) => setSection(e.target.value)} required disabled={verificationSent}>
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
          <div className="mb-6 flex items-center">
            <input type="checkbox" id="diploma" checked={isDiploma} onChange={() => setIsDiploma(!isDiploma)} className="mr-2" />
            <label htmlFor="diploma" className="text-gray-300">Click if you are a Diploma student</label>
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Password</label>
            <input type="password" className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={verificationSent} />
          </div>
          {verificationSent && (
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Enter OTP</label>
              <input type="text" className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
          )}
          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300" disabled={loading}>
            {loading ? (verificationSent ? "Verifying OTP..." : "Signing up...") : (verificationSent ? "Verify OTP" : "Sign Up")}
          </button>
          {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
        </form>
      </div>
    </section>
  );
}

export default StudentSignUp;
