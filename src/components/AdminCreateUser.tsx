import React, { useState } from "react";

interface UserData {
  email: string;
  fullname: string;
  password: string;
  role: "Admin" | "ProjectManager" | "TeamMember"; // Define los posibles valores de role
}

interface AdminCreateUserProps {
  onClose: () => void;
  onCreateUser: (userData: UserData) => Promise<void>;
}

const AdminCreateUser = ({ onClose, onCreateUser }: AdminCreateUserProps) => {
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserData["role"]>("TeamMember"); // Define el estado con el tipo 'role'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData: UserData = { email, fullname, password, role };
    await onCreateUser(userData);
    onClose(); // Cierra el modal después de la creación del usuario
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-4 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create User</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black border p-2 mb-4 w-full"
            required
          />
          <label>Full Name:</label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="bg-black border p-2 mb-4 w-full"
            required
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-black border p-2 mb-4 w-full"
            required
          />
          <label>Role:</label>
          <select
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value as "Admin" | "ProjectManager" | "TeamMember"
              )
            }
            className="bg-black border p-2 mb-4 w-full"
          >
            <option value="Admin">Admin</option>
            <option value="ProjectManager">Project Manager</option>
            <option value="TeamMember">Team Member</option>
          </select>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 mr-2 rounded"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateUser;
