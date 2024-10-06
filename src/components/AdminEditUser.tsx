"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminEditUser = ({ userId, onClose, onSave }: { userId: string; onClose: () => void; onSave: () => void }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("TeamMember");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/api/users?userId=${userId}`);
      const { fullname, email, role } = res.data;
      setFullname(fullname);
      setEmail(email);
      setRole(role);
    };
    fetchUser();
  }, [userId]);

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`/api/users?userId=${userId}`, { fullname, email, role });
      Swal.fire("Success", "User updated successfully!", "success");
      onSave();  // Llama a onSave para actualizar la lista de usuarios
      onClose(); // Cierra el modal tras editar el usuario
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update user", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-black p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Edit User</h2>
        <form onSubmit={handleUpdateUser}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="bg-gray-900 w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-900 w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-gray-900 w-full p-2 border rounded"
            >
              <option value="Admin">Admin</option>
              <option value="ProjectManager">Project Manager</option>
              <option value="TeamMember">Team Member</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-900 bg-gray-500 text-white px-4 py-2 mr-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditUser;