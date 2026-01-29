"use client";

import { useState } from "react";
import { Role } from "@/app/types/roles";
import CustomerModal from "./customer";

export interface User {
  id?: string;
  username: string;
  password?: string;
  role: Role;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (user: User) => Promise<void>;
  isLoading?: boolean;
}

export default function UserModal({
  open,
  onClose,
  onSave,
  isLoading = false,
}: Props) {
  const [user, setUser] = useState<User>({
    username: "",
    password: "",
    role: Role.Staff,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSave = async () => {
    const newErrors: string[] = [];

    if (!user.username || user.username.trim() === "") {
      newErrors.push("Username is required");
    } else if (user.username.length < 6) {
      newErrors.push("Username must be at least 6 characters");
    }

    if (!user.password || user.password.trim() === "") {
      newErrors.push("Password is required");
    } else if (user.password.length < 6) {
      newErrors.push("Password must be at least 6 characters");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);
    try {
      await onSave(user);
      setUser({
        username: "",
        password: "",
        role: Role.Staff,
      });
    } catch (error: any) {
      console.error("Error saving user:", error);
      // Show backend error in modal
      if (error.message) {
        setErrors([error.message]);
      } else {
        setErrors(["Failed to create user"]);
      }
    }
  };

  const handleClose = () => {
    setUser({
      username: "",
      password: "",
      role: Role.Staff,
    });
    setErrors([]);
    onClose();
  };

  return (
    <CustomerModal
      open={open}
      title="Add New User"
      onClose={handleClose}
      width="md"
      footer={
        <>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-700 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-gold text-black rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create User
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {errors.length > 0 && (
          <div className="bg-red-900/20 border border-red-700 rounded p-3">
            {errors.map((error, idx) => (
              <p key={idx} className="text-red-400 text-sm">
                • {error}
              </p>
            ))}
          </div>
        )}

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Username</label>
          <input
            type="text"
            value={user.username}
            onChange={(e) => {
              setUser({ ...user, username: e.target.value });
              if (errors.length > 0) setErrors([]);
            }}
            placeholder="Enter username"
            className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Password</label>
          <input
            type="password"
            value={user.password}
            onChange={(e) => {
              setUser({ ...user, password: e.target.value });
              if (errors.length > 0) setErrors([]);
            }}
            placeholder="Enter password (min 6 characters)"
            className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Role</label>
          <select
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value as Role })}
            className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-gold"
          >
            <option value={Role.Staff}>Staff</option>
            <option value={Role.Tailor}>Tailor</option>
            <option value={Role.Admin}>Admin</option>
          </select>
        </div>
      </div>
    </CustomerModal>
  );
}
