import React, { useState, useEffect } from "react";
import Card from "components/card";

const Profession = () => {
  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ id: 0, name: "" });
  const [editMode, setEditMode] = useState(false);

  const token = localStorage.getItem("token");

  // Common headers with auth
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json-patch+json",
  };

  // Fetch professions (GET)
  const fetchProfessions = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://sani3ywebapiv1.runasp.net/api/Profession", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch professions");
      const data = await res.json();
      setProfessions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProfessions();
  }, [token]);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create profession (POST)
  const createProfession = async () => {
    if (!form.name.trim()) return alert("Name required");
    try {
      const res = await fetch("http://sani3ywebapiv1.runasp.net/api/Profession", {
        method: "POST",
        headers,
        body: JSON.stringify({ id: 0, name: form.name }),
      });
      if (!res.ok) throw new Error("Failed to create profession");
      alert("Created successfully");
      setForm({ id: 0, name: "" });
      fetchProfessions();
    } catch (error) {
      console.error(error);
    }
  };

  // Update profession (PUT)
  const updateProfession = async () => {
    if (!form.name.trim()) return alert("Name required");
    try {
      const res = await fetch(`http://sani3ywebapiv1.runasp.net/api/Profession/${form.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ id: form.id, name: form.name }),
      });
      if (!res.ok) throw new Error("Failed to update profession");
      alert("Updated successfully");
      setForm({ id: 0, name: "" });
      setEditMode(false);
      fetchProfessions();
    } catch (error) {
      console.error(error);
    }
  };

  // Delete profession (DELETE)
  const deleteProfession = async (id) => {
    if (!window.confirm("Are you sure you want to delete this profession?")) return;
    try {
      const res = await fetch(`http://sani3ywebapiv1.runasp.net/api/Profession/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete profession");
      alert("Deleted successfully");
      fetchProfessions();
    } catch (error) {
      console.error(error);
    }
  };

  // Start editing
  const editHandler = (prof) => {
    setForm({ id: prof.id, name: prof.name });
    setEditMode(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setForm({ id: 0, name: "" });
    setEditMode(false);
  };

  return (
    <div className="mt-5">
      <Card extra="w-full pb-10 p-4 h-full">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-navy-700 dark:text-white">Professions</h2>
          <button
            onClick={() => {
              setForm({ id: 0, name: "" });
              setEditMode(false);
            }}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Clear
          </button>
        </header>

        <div className="mb-6">
          <input
            type="text"
            name="name"
            placeholder="Profession name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded mr-2"
          />
          {editMode ? (
            <>
              <button
                onClick={updateProfession}
                className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
              >
                Update
              </button>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={createProfession}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Add
            </button>
          )}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full whitespace-nowrap border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 py-2 px-4">ID</th>
                <th className="border border-gray-300 py-2 px-4">Name</th>
                <th className="border border-gray-300 py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {professions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No professions found.
                  </td>
                </tr>
              ) : (
                professions.map((prof) => (
                  <tr key={prof.id} className="border border-gray-300">
                    <td className="border border-gray-300 py-2 px-4">{prof.id}</td>
                    <td className="border border-gray-300 py-2 px-4">{prof.name}</td>
                    <td className="border border-gray-300 py-2 px-4">
                      <button
                        onClick={() => editHandler(prof)}
                        className="mr-2 px-3 py-1 bg-yellow-400 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProfession(prof.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default Profession;
