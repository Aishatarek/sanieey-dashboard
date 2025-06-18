import React, { useState, useEffect } from "react";
import Card from "components/card";
import Swal from "sweetalert2";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: ""
  });
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const token = localStorage.getItem("token");

  // جلب جميع المستخدمين
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://sani3ywebapiv1.runasp.net/api/UserManagement/all-users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('فشل في جلب المستخدمين');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('خطأ في جلب المستخدمين:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء جلب المستخدمين',
        confirmButtonText: 'حسناً'
      });
    } finally {
      setLoading(false);
    }
  };

  // حذف مستخدم
  const deleteUser = async (userId) => {
    try {
      const result = await Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'لن تتمكن من استعادة هذا المستخدم بعد الحذف!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#d33',
        reverseButtons: true
      });
      
      if (result.isConfirmed) {
        const response = await fetch(`https://sani3ywebapiv1.runasp.net/api/UserManagement/delete-user/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('فشل في حذف المستخدم');
        }
        
        // تحديث القائمة بعد الحذف
        setUsers(users.filter(user => user.id !== userId));
        
        Swal.fire({
          icon: 'success',
          title: 'تم الحذف',
          text: 'تم حذف المستخدم بنجاح',
          confirmButtonText: 'حسناً'
        });
      }
    } catch (error) {
      console.error('خطأ في حذف المستخدم:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء حذف المستخدم',
        confirmButtonText: 'حسناً'
      });
    }
  };

  // إرسال إشعار للمستخدم المحدد
  const sendNotification = async () => {
    if (!selectedUser) return;
    
    if (!notificationData.title || !notificationData.message) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'العنوان والمحتوى مطلوبان',
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
        body: JSON.stringify({
          userId: selectedUser.id,
          title: notificationData.title,
          message: notificationData.message
        })
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
      
      // مسح الحقول بعد الإرسال وإغلاق المودال
      setNotificationData({
        title: "",
        message: ""
      });
      setShowNotificationModal(false);
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

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="mt-5">
      <Card extra={"w-full p-4"}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
          <button 
            onClick={fetchAllUsers}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            تحديث القائمة
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              {users.length === 0 ? (
                <p className="text-gray-500 text-center py-8">لا يوجد مستخدمين مسجلين حالياً</p>
              ) : (
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 border">#</th>
                      <th className="p-3 border">الصورة</th>
                      <th className="p-3 border">الاسم الكامل</th>
                      <th className="p-3 border">البريد الإلكتروني</th>
                      <th className="p-3 border">رقم الهاتف</th>
                      <th className="p-3 border">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr 
                        key={user.id} 
                        className={`hover:bg-gray-50 ${selectedUser?.id === user.id ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedUser(user)}
                        style={{cursor: 'pointer'}}
                      >
                        <td className="p-3 border">{index + 1}</td>
                        <td className="p-3 border">
                          {user.profileImage ? (
                            <img 
                              src={`https://sani3ywebapiv1.runasp.net${user.profileImage}`} 
                              alt="صورة المستخدم" 
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">لا توجد صورة</span>
                            </div>
                          )}
                        </td>
                        <td className="p-3 border">{user.fullName}</td>
                        <td className="p-3 border">{user.email}</td>
                        <td className="p-3 border">{user.phoneNumer}</td>
                        <td className="p-3 border">
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteUser(user.id);
                              }}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            >
                              حذف
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUser(user);
                                setShowNotificationModal(true);
                              }}
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            >
                              إرسال إشعار
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

 
          </div>
        )}
      </Card>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">إرسال إشعار للمستخدم</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الإشعار</label>
                  <input
                    type="text"
                    name="title"
                    value={notificationData.title}
                    onChange={(e) => setNotificationData({...notificationData, title: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="عنوان الإشعار"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نص الإشعار</label>
                  <textarea
                    name="message"
                    value={notificationData.message}
                    onChange={(e) => setNotificationData({...notificationData, message: e.target.value})}
                    rows="4"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="نص الإشعار"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 space-x-reverse">
              <button
                onClick={() => setShowNotificationModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={sendNotification}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} transition-colors`}
              >
                {loading ? 'جاري الإرسال...' : 'إرسال الإشعار'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;