import React, { useState, useEffect } from "react";
import Card from "components/card";

const Recommendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRec, setSelectedRec] = useState(null);
  const [loading, setLoading] = useState(false);
  const [craftsmanData, setCraftsmanData] = useState({
    FirstName: "",
    LastName: "",
    Governorate: "",
    Location: "",
    ProfessionId: "",
    PhoneNumber: "",
    Email: "",
    Password: "",
    CardImage: null,
    ProfileImage: null,
  });

  const token = localStorage.getItem("token");

  const fetchRecommendations = async () => {
    if (!token) return console.error("No token found in localStorage");
    setLoading(true);
    try {
      const res = await fetch(
        "http://sani3ywebapiv1.runasp.net/api/Recommendation/pending-recommendations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setRecommendations(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchRecommendationById = async (id) => {
    if (!token) return console.error("No token found in localStorage");
    try {
      const res = await fetch(
        `http://sani3ywebapiv1.runasp.net/api/Recommendation/recommendation/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setSelectedRec(data);
    } catch (err) {
      console.error(err);
    }
  };

  const approveRecommendation = async (id) => {
    if (!token) return console.error("No token found in localStorage");
    try {
      const res = await fetch(
        `http://sani3ywebapiv1.runasp.net/api/Recommendation/approve/${id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      alert("Recommendation approved");
      fetchRecommendations(); // refresh list
      setSelectedRec(null);
    } catch (err) {
      console.error(err);
    }
  };

  const rejectRecommendation = async (id) => {
    if (!token) return console.error("No token found in localStorage");
    try {
      const res = await fetch(
        `http://sani3ywebapiv1.runasp.net/api/Recommendation/reject/${id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      alert("Recommendation rejected");
      fetchRecommendations(); // refresh list
      setSelectedRec(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle form change for craftsman data
  const handleCraftsmanChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setCraftsmanData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setCraftsmanData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Add craftsman to recommendation
  const addCraftsman = async (recommendationId) => {
    if (!token) return console.error("No token found in localStorage");

    const formData = new FormData();
    for (const key in craftsmanData) {
      if (craftsmanData[key]) formData.append(key, craftsmanData[key]);
    }

    try {
      const res = await fetch(
        `http://sani3ywebapiv1.runasp.net/api/Recommendation/add-craftsman/${recommendationId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      alert("Craftsman added successfully");
      setCraftsmanData({
        FirstName: "",
        LastName: "",
        Governorate: "",
        Location: "",
        ProfessionId: "",
        PhoneNumber: "",
        Email: "",
        Password: "",
        CardImage: null,
        ProfileImage: null,
      });
      fetchRecommendations();
      setSelectedRec(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="mt-5">
      <Card extra="w-full pb-10 p-4 h-full">
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-navy-700 dark:text-white">
            Pending Recommendations
          </h2>
        </header>

        {loading && <p>Loading...</p>}

        {!selectedRec && (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="py-4 px-8 text-left">ID</th>
                  <th className="py-4 px-8 text-left">Title</th>
                  <th className="py-4 px-8 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.map((rec) => (
                  <tr key={rec.id} className="border-b dark:border-gray-700">
                    <td className="py-4 px-8">{rec.id}</td>
                    <td className="py-4 px-8">{rec.title || rec.name || "No title"}</td>
                    <td className="py-4 px-8">
                      <button
                        className="mr-2 text-blue-600"
                        onClick={() => fetchRecommendationById(rec.id)}
                      >
                        View
                      </button>
                      <button
                        className="mr-2 text-green-600"
                        onClick={() => approveRecommendation(rec.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="text-red-600"
                        onClick={() => rejectRecommendation(rec.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedRec && (
          <div className="mt-8">
            <button
              className="mb-4 text-gray-500 underline"
              onClick={() => setSelectedRec(null)}
            >
              ← Back to list
            </button>

            <h3 className="text-lg font-bold mb-4">Recommendation Details (ID: {selectedRec.id})</h3>
            <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">{JSON.stringify(selectedRec, null, 2)}</pre>

            <h4 className="mt-6 mb-2 font-semibold">Add Craftsman</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addCraftsman(selectedRec.id);
              }}
              className="space-y-4"
            >
              <input
                name="FirstName"
                value={craftsmanData.FirstName}
                onChange={handleCraftsmanChange}
                placeholder="First Name"
                required
                className="input-field"
              />
              <input
                name="LastName"
                value={craftsmanData.LastName}
                onChange={handleCraftsmanChange}
                placeholder="Last Name"
                required
                className="input-field"
              />
              <input
                name="Governorate"
                value={craftsmanData.Governorate}
                onChange={handleCraftsmanChange}
                placeholder="Governorate"
                required
                className="input-field"
              />
              <input
                name="Location"
                value={craftsmanData.Location}
                onChange={handleCraftsmanChange}
                placeholder="Location"
                required
                className="input-field"
              />
              <input
                name="ProfessionId"
                value={craftsmanData.ProfessionId}
                onChange={handleCraftsmanChange}
                placeholder="Profession Id"
                type="number"
                required
                className="input-field"
              />
              <input
                name="PhoneNumber"
                value={craftsmanData.PhoneNumber}
                onChange={handleCraftsmanChange}
                placeholder="Phone Number"
                required
                className="input-field"
              />
              <input
                name="Email"
                value={craftsmanData.Email}
                onChange={handleCraftsmanChange}
                placeholder="Email"
                type="email"
                required
                className="input-field"
              />
              <input
                name="Password"
                value={craftsmanData.Password}
                onChange={handleCraftsmanChange}
                placeholder="Password"
                type="password"
                required
                className="input-field"
              />
              <label>
                Card Image:
                <input
                  type="file"
                  name="CardImage"
                  onChange={handleCraftsmanChange}
                  accept="image/*"
                  required
                />
              </label>
              <label>
                Profile Image:
                <input
                  type="file"
                  name="ProfileImage"
                  onChange={handleCraftsmanChange}
                  accept="image/*"
                  required
                />
              </label>
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add Craftsman
              </button>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Recommendation;
