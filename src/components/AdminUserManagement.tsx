"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; 
import axios from "axios";
import Swal from "sweetalert2";
import AdminEditUser from "./AdminEditUser";
import AdminCreateUser from "./AdminCreateUser";

// Definir la interfaz de User
interface User {
  _id: string;
  email: string;
  fullname: string;
  role: string;
}

// Definir la interfaz para la creación de usuario (sin _id)
interface CreateUserData {
  email: string;
  fullname: string;
  password: string;
  role: string;
}

const AdminUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isEditUserOpen, setIsEditUserOpen] = useState<{ open: boolean; userId: string | null }>({
    open: false,
    userId: null,
  });
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const { data: session } = useSession();

  // Función para obtener la lista de usuarios
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`/api/users?userLogueado=${session?.user._id}`);
      setUsers(res.data.users); // Actualiza la lista de usuarios
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Obtener usuarios cuando el componente se monta
  }, []);

  // Función para manejar la eliminación de un usuario
  const handleDeleteUser = async (userId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/users?userId=${userId}`);
        Swal.fire("Deleted!", "User has been deleted.", "success");
        fetchUsers(); // Actualizar la lista después de eliminar el usuario
      } catch (error) {
        console.error("Failed to delete user:", error);
        Swal.fire("Error", "Failed to delete user", "error");
      }
    }
  };

  // Función para manejar la creación de un nuevo usuario
  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      await axios.post("/api/users", userData);
      Swal.fire("Success", "User created successfully!", "success");
      fetchUsers(); // Actualiza la lista después de crear un nuevo usuario
    } catch (error) {
      console.error("Failed to create user:", error);
      Swal.fire("Error", "Failed to create user", "error");
    }
  };

  return (
    <div className="bg-gray-900 max-w-full md:max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <p className="mb-4">Welcome to the admin page! Here you can manage users by creating new accounts, editing user details, or removing users from the system.</p>
      <button onClick={() => setIsCreateUserOpen(true)} className="bg-blue-500 text-white p-2 rounded mb-4">
        Create User
      </button>
      <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th>Email</th>
            <th>Full Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.fullname}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => setIsEditUserOpen({ open: true, userId: user._id })}
                  className="bg-orange-500 text-white p-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-600 text-white p-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {isCreateUserOpen && (
        <AdminCreateUser
          onClose={() => setIsCreateUserOpen(false)}
          onCreateUser={handleCreateUser}
        />
      )}
      {isEditUserOpen.open && (
        <AdminEditUser
          userId={isEditUserOpen.userId!}
          onClose={() => setIsEditUserOpen({ open: false, userId: null })}
          onSave={() => fetchUsers()} // Actualiza usuarios después de guardar cambios
        />
      )}
    </div>
  );
};

export default AdminUserManagement;
