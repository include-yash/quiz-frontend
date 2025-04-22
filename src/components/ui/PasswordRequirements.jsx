"use client";
import { validatePassword } from "../../utils/validation";
import { CheckCircle, XCircle } from "react-feather";
import { motion } from "framer-motion";

export const PasswordRequirements = ({ password }) => {
  const validation = validatePassword(password);

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="mt-4 w-full max-w-md rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 p-6 backdrop-blur-lg shadow-xl border border-gray-700/50">
      <h3 className="mb-4 text-lg font-semibold text-white tracking-wide">
        Password Requirements
      </h3>
      <ul className="space-y-3">
        {/* At least 8 characters */}
        <motion.li
          variants={listItemVariants}
          initial="hidden"
          animate="visible"
          className={`flex items-center gap-3 rounded-md p-2 transition-all duration-300 ${
            validation.requirements.minLength
              ? "bg-green-500/10 text-green-400"
              : "bg-gray-700/20 text-gray-400"
          }`}
        >
          {validation.requirements.minLength ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : (
            <XCircle className="h-5 w-5 text-gray-400" />
          )}
          <span className="text-sm">At least 8 characters</span>
        </motion.li>

        {/* Uppercase letter */}
        <motion.li
          variants={listItemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className={`flex items-center gap-3 rounded-md p-2 transition-all duration-300 ${
            validation.requirements.hasUpperCase
              ? "bg-green-500/10 text-green-400"
              : "bg-gray-700/20 text-gray-400"
          }`}
        >
          {validation.requirements.hasUpperCase ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : (
            <XCircle className="h-5 w-5 text-gray-400" />
          )}
          <span className="text-sm">One uppercase letter (A-Z)</span>
        </motion.li>

        {/* Lowercase letter */}
        <motion.li
          variants={listItemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className={`flex items-center gap-3 rounded-md p-2 transition-all duration-300 ${
            validation.requirements.hasLowerCase
              ? "bg-green-500/10 text-green-400"
              : "bg-gray-700/20 text-gray-400"
          }`}
        >
          {validation.requirements.hasLowerCase ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : (
            <XCircle className="h-5 w-5 text-gray-400" />
          )}
          <span className="text-sm">One lowercase letter (a-z)</span>
        </motion.li>

        {/* Number */}
        <motion.li
          variants={listItemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className={`flex items-center gap-3 rounded-md p-2 transition-all duration-300 ${
            validation.requirements.hasNumber
              ? "bg-green-500/10 text-green-400"
              : "bg-gray-700/20 text-gray-400"
          }`}
        >
          {validation.requirements.hasNumber ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : (
            <XCircle className="h-5 w-5 text-gray-400" />
          )}
          <span className="text-sm">One number (0-9)</span>
        </motion.li>

        {/* Special character */}
        <motion.li
          variants={listItemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className={`flex items-center gap-3 rounded-md p-2 transition-all duration-300 ${
            validation.requirements.hasSpecialChar
              ? "bg-green-500/10 text-green-400"
              : "bg-gray-700/20 text-gray-400"
          }`}
        >
          {validation.requirements.hasSpecialChar ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : (
            <XCircle className="h-5 w-5 text-gray-400" />
          )}
          <span className="text-sm">One special character (!@#$%^&*)</span>
        </motion.li>
      </ul>
    </div>
  );
};