import React, { useState, useEffect } from "react";
import Card from "components/card";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }
  
    fetch("http://sani3ywebapiv1.runasp.net/api/AdminDashboard/GetContactMessages", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json", // Use "application/json" not "text/plain"
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setMessages(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);
  
  
  return (
    <div className="mt-5">
      <Card extra="w-full pb-10 p-4 h-full">
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-navy-700 dark:text-white">
            Contact Messages
          </h2>
        </header>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="py-4 px-8 text-left">Name</th>
                <th className="py-4 px-8 text-left">Email</th>
                <th className="py-4 px-8 text-left">Phone</th>
                <th className="py-4 px-8 text-left">Message</th>
                <th className="py-4 px-8 text-left">Request #</th>
                <th className="py-4 px-8 text-left">Sent At</th>
                <th className="py-4 px-8 text-left">Resolved</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id} className="border-b dark:border-gray-700">
                  <td className="py-4 px-8">{msg.name}</td>
                  <td className="py-4 px-8">{msg.email}</td>
                  <td className="py-4 px-8">{msg.phoneNumber}</td>
                  <td className="py-4 px-8">{msg.messageContent}</td>
                  <td className="py-4 px-8">{msg.requestNumber}</td>
                  <td className="py-4 px-8">{new Date(msg.sentAt).toLocaleString()}</td>
                  <td className="py-4 px-8">{msg.isResolved ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Messages;
