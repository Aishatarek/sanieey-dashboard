import React, { useState } from "react";
import Card from "components/card";
import Swal from "sweetalert2";

const Notifications = () => {
  const [notificationData, setNotificationData] = useState({
    userId: "",
    title: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotificationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendNotification = async () => {
    if (!notificationData.userId || !notificationData.title || !notificationData.message) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'جميع الحقول مطلوبة',
        confirmButtonText: 'حسناً'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://sani3ywebapiv1.runasp.net/api/Notification/send-notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificationData)
      });
      
      if (!response.ok) {
        throw new Error('فشل في إرسال الإشعار');
      }
      
      Swal.fire({
        icon: 'success',
        title: 'تم الإرسال',
        text: 'تم إرسال الإشعار بنجاح',
        confirmButtonText: 'حسناً'
      });
      
      // مسح الحقول بعد الإرسال
      setNotificationData({
        userId: "",
        title: "",
        message: ""
      });
    } catch (error) {
      console.error('خطأ في إرسال الإشعار:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء إرسال الإشعار',
        confirmButtonText: 'حسناً'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <Card extra={"w-full p-4"}>
        <h1 className="text-2xl font-bold mb-6">إرسال إشعارات</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">معرف المستخدم</label>
            <input
              type="text"
              name="userId"
              value={notificationData.userId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أدخل معرف المستخدم"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الإشعار</label>
            <input
              type="text"
              name="title"
              value={notificationData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أدخل عنوان الإشعار"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نص الإشعار</label>
            <textarea
              name="message"
              value={notificationData.message}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أدخل نص الإشعار"
            ></textarea>
          </div>
          
          <button
            onClick={sendNotification}
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition-colors`}
          >
            {loading ? 'جاري الإرسال...' : 'إرسال الإشعار'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Notifications;