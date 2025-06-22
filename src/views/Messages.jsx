import React, { useState, useEffect } from "react";
import Card from "components/card";
import Swal from "sweetalert2";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("لم يتم العثور على توكن في التخزين المحلي");
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "لم يتم العثور على توكن التوثيق",
        confirmButtonText: "حسناً",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://sani3ywebapiv1.runasp.net/api/AdminDashboard/GetContactMessages",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`فشل الطلب: ${res.status}`);
      }

      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("خطأ في جلب الرسائل:", err);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء جلب الرسائل",
        confirmButtonText: "حسناً",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (requestNumber) => {
    const token = localStorage.getItem("token");
    
    try {
      const result = await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "هل تريد حقاً حل هذا الطلب؟",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "نعم، حل الطلب",
        cancelButtonText: "إلغاء",
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `https://sani3ywebapiv1.runasp.net/api/AdminDashboard/resolve/${requestNumber}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`فشل الطلب: ${response.status}`);
        }

        await Swal.fire({
          icon: "success",
          title: "تم بنجاح",
          text: "تم حل الطلب بنجاح",
          confirmButtonText: "حسناً",
        });

        // Refresh the messages list
        fetchMessages();
      }
    } catch (err) {
      console.error("خطأ في حل الطلب:", err);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء حل الطلب",
        confirmButtonText: "حسناً",
      });
    }
  };

  return (
    <div className="mt-5">
      <Card extra="w-full pb-10 p-4 h-full">
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-navy-700 dark:text-white">
            رسائل التواصل
          </h2>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-right border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="py-4 px-8 border border-gray-300">الاسم</th>
                  <th className="py-4 px-8 border border-gray-300">البريد الإلكتروني</th>
                  <th className="py-4 px-8 border border-gray-300">رقم الهاتف</th>
                  <th className="py-4 px-8 border border-gray-300">الرسالة</th>
                  <th className="py-4 px-8 border border-gray-300">رقم الطلب</th>
                  <th className="py-4 px-8 border border-gray-300">تاريخ الإرسال</th>
                  <th className="py-4 px-8 border border-gray-300">تم الحل</th>
                  <th className="py-4 px-8 border border-gray-300">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {messages.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      لا توجد رسائل مسجلة حالياً.
                    </td>
                  </tr>
                ) : (
                  messages.map((msg) => (
                    <tr key={msg.id} className="border-b dark:border-gray-700 hover:bg-gray-50">
                      <td className="py-4 px-8 border border-gray-300">{msg.name}</td>
                      <td className="py-4 px-8 border border-gray-300">{msg.email}</td>
                      <td className="py-4 px-8 border border-gray-300">{msg.phoneNumber}</td>
                      <td className="py-4 px-8 border border-gray-300">{msg.messageContent}</td>
                      <td className="py-4 px-8 border border-gray-300">{msg.requestNumber}</td>
                      <td className="py-4 px-8 border border-gray-300">
                        {new Date(msg.sentAt).toLocaleString("ar-EG")}
                      </td>
                      <td className="py-4 px-8 border border-gray-300">
                        {msg.isResolved ? "نعم" : "لا"}
                      </td>
                      <td className="py-4 px-8 border border-gray-300">
                        {!msg.isResolved && (
                          <button
                            onClick={() => handleResolve(msg.requestNumber)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                          >
                            حل الطلب
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Messages;