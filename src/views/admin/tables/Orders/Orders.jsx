import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import Card from "components/card";

const Orders = () => {
  const [tasks, setTasks] = useState([]);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const [documentId, setDocumentId] = useState("");

  const firebaseConfig = {
    apiKey: "AIzaSyDbvm9_2fGM0rg1jk_3diPOjznBXtiHieQ",
    authDomain: "door-closers-90dca.firebaseapp.com",
    projectId: "door-closers-90dca",
    storageBucket: "door-closers-90dca.appspot.com",
    messagingSenderId: "866575330941",
    appId: "1:866575330941:web:4277e3d5c22f00ab15cb14",
    measurementId: "G-9WWZMMMBDX",
  };
  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const database = getFirestore(app);

    const unsubscribe = onSnapshot(collection(database, "ticketSystem"), (snapshot) => {
      const tasksArray = [];
      snapshot.forEach((doc) => {
        for (const taskId in doc.data()) {
          const task = {
            id: taskId,
            ...doc.data()[taskId],
          };
          tasksArray.push(task);
        }
        setDocumentId(doc.id);
      });
      tasksArray.sort((a, b) => (a.Email && b.Email) ? a.Email.localeCompare(b.Email) : 0);
      setTasks(tasksArray);
    });

    setFirebaseInitialized(true);

    return () => unsubscribe();
  }, [firebaseConfig]);

  return (
    <>
      <div className="mt-5">
        <Card extra="w-full pb-10 p-4 h-full">
          <header className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              Tickets
            </h2>
          </header>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="py-4 px-8 text-left">Name</th>
                  <th className="py-4 px-8 text-left">Email</th>
                  <th className="py-4 px-8 text-left">Phone</th>
                  <th className="py-4 px-8 text-left">Project Name</th>
                  <th className="py-4 px-8 text-left">Project Type</th>
                  <th className="py-4 px-8 text-left">Project Description</th>
                  <th className="py-4 px-8 text-left">Initial Deadline</th>
                  <th className="py-4 px-8 text-left">Developer Deadline</th>
                  <th className="py-4 px-8 text-left">Task Progress</th>
                  <th className="py-4 px-8 text-left">Submitted Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b dark:border-gray-700">
                    <td className="py-4 px-8">{task.name}</td>
                    <td className="py-4 px-8">{task.Email}</td>
                    <td className="py-4 px-8">{task.phone}</td>
                    <td className="py-4 px-8">{task.projectName}</td>
                    <td className="py-4 px-8">{task.projectType}</td>
                    <td className="py-4 px-8">{task.projectDescription}</td>
                    <td className="py-4 px-8">{task.suggestedETA}</td>
                    <td className="py-4 px-8">{task.devETA}</td>
                    <td className="py-4 px-8">
                      <div className="flex items-center">
                        <div className="w-full">
                          <div className="h-6 rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${task.progress || 0}%`,
                                backgroundColor: "#ed5b27",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                              }}
                            >
                              <div
                                className="bg-#ed5b27 text-black flex h-full items-center justify-center rounded-full text-xs"
                                style={{
                                  width: `${task.progress || 0}%`,
                                  position: "absolute",
                                  left: "20px",
                                  zIndex: 1,
                                }}
                              >
                                {task.progress || 0}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-8">{task.submittedTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Orders;
