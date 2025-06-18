import React, { useState, useEffect } from "react";
import Card from "components/card";
import Swal from "sweetalert2";

const Craftsmen = () => {
  const [craftsmen, setCraftsmen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCraftsman, setSelectedCraftsman] = useState(null);
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: ""
  });
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const token = localStorage.getItem("token");

  const fetchAllCraftsmen = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://sani3ywebapiv1.runasp.net/api/UserManagement/all-craftsmen', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('فشل في جلب الحرفيين');
      }
      
      const data = await response.json();
      setCraftsmen(data);
    } catch (error) {
      console.error('خطأ في جلب الحرفيين:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء جلب الحرفيين',
        confirmButtonText: 'حسناً'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCraftsman = async (craftsmanId) => {
    try {
      const result = await Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'لن تتمكن من استعادة هذا الحرفي بعد الحذف!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#d33',
        reverseButtons: true
      });
      
      if (result.isConfirmed) {
        const response = await fetch(`https://sani3ywebapiv1.runasp.net/api/UserManagement/delete-user/${craftsmanId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('فشل في حذف الحرفي');
        }
        
        setCraftsmen(craftsmen.filter(craftsman => craftsman.id !== craftsmanId));
        
        Swal.fire({
          icon: 'success',
          title: 'تم الحذف',
          text: 'تم حذف الحرفي بنجاح',
          confirmButtonText: 'حسناً'
        });
      }
    } catch (error) {
      console.error('خطأ في حذف الحرفي:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء حذف الحرفي',
        confirmButtonText: 'حسناً'
      });
    }
  };

  const sendNotification = async () => {
    if (!selectedCraftsman) return;
    
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
          userId: selectedCraftsman.id,
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
    fetchAllCraftsmen();
  }, []);

  return (
    <div className="mt-5">
      <Card extra={"w-full p-4"}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">إدارة الحرفيين</h1>
          <button 
            onClick={fetchAllCraftsmen}
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
              {craftsmen.length === 0 ? (
                <p className="text-gray-500 text-center py-8">لا يوجد حرفيين مسجلين حالياً</p>
              ) : (
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 border">#</th>
                      <th className="p-3 border">الصورة</th>
                      <th className="p-3 border">الاسم</th>
                      <th className="p-3 border">الحرفة</th>
                      <th className="p-3 border">المحافظة</th>
                      <th className="p-3 border">التقييم</th>
                      <th className="p-3 border">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {craftsmen.map((craftsman, index) => (
                      <tr 
                        key={craftsman.id} 
                        className={`hover:bg-gray-50 ${selectedCraftsman?.id === craftsman.id ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedCraftsman(craftsman)}
                        style={{cursor: 'pointer'}}
                      >
                        <td className="p-3 border">{index + 1}</td>
                        <td className="p-3 border">
                          <img 
                            src={craftsman.profileImage ? `https://sani3ywebapiv1.runasp.net${craftsman.profileImage}` : '/img/default-profile.png'} 
                            alt="صورة الحرفي" 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </td>
                        <td className="p-3 border">{craftsman.fullName}</td>
                        <td className="p-3 border">{craftsman.profession}</td>
                        <td className="p-3 border">{craftsman.governorate}</td>
                        <td className="p-3 border">
                          <div className="flex items-center justify-end">
                            <span className="text-yellow-500 mr-1">{craftsman.averageRating || '0'}</span>
                            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </td>
                        <td className="p-3 border">
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCraftsman(craftsman.id);
                              }}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            >
                              حذف
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCraftsman(craftsman);
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
              <h2 className="text-xl font-bold mb-4">إرسال إشعار للحرفي</h2>
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

export default Craftsmen;