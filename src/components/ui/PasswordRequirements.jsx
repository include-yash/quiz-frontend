"use client"
import { validatePassword } from "../../utils/validation";

export const PasswordRequirements = ({ password }) => {
  const validation = validatePassword(password);
  
  return (
    <div className="mt-2 text-xs text-gray-400">
      Password must contain:
      <ul className="list-disc pl-5 space-y-1 mt-1">
        <li className={validation.requirements.minLength ? 'text-green-400' : ''}>
          At least 8 characters
        </li>
        <li className={validation.requirements.hasUpperCase ? 'text-green-400' : ''}>
          One uppercase letter (A-Z)
        </li>
        <li className={validation.requirements.hasLowerCase ? 'text-green-400' : ''}>
          One lowercase letter (a-z)
        </li>
        <li className={validation.requirements.hasNumber ? 'text-green-400' : ''}>
          One number (0-9)
        </li>
        <li className={validation.requirements.hasSpecialChar ? 'text-green-400' : ''}>
          One special character (!@#$%^&*)
        </li>
      </ul>
    </div>
  );
};