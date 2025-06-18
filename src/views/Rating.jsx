import React, { useState, useEffect } from "react";
import Card from "components/card";
import Swal from "sweetalert2";

const Ratings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchAllRatings = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://sani3ywebapiv1.runasp.net/api/RatingManagement/all-ratings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('فشل في جلب التقييمات');
      }
      
      const data = await response.json();
      setRatings(data);
    } catch (error) {
      console.error('خطأ في جلب التقييمات:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء جلب التقييمات',
        confirmButtonText: 'حسناً'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteRating = async (ratingId) => {
    try {
      const result = await Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'لن تتمكن من استعادة هذا التقييم بعد الحذف!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#d33',
        reverseButtons: true
      });
      
      if (result.isConfirmed) {
        const response = await fetch(`https://sani3ywebapiv1.runasp.net/api/RatingManagement/delete-rating/${ratingId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('فشل في حذف التقييم');
        }
        
        // تحديث القائمة بعد الحذف
        setRatings(ratings.filter(rating => rating.id !== ratingId));
        
        Swal.fire({
          icon: 'success',
          title: 'تم الحذف',
          text: 'تم حذف التقييم بنجاح',
          confirmButtonText: 'حسناً'
        });
      }
    } catch (error) {
      console.error('خطأ في حذف التقييم:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء حذف التقييم',
        confirmButtonText: 'حسناً'
      });
    }
  };

  useEffect(() => {
    fetchAllRatings();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  return (
    <div className="mt-5">
      <Card extra={"w-full p-4"}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">إدارة التقييمات</h1>
          <button 
            onClick={fetchAllRatings}
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
              {ratings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">لا توجد تقييمات متاحة</p>
              ) : (
                <table className="w-full border-collapse text-right">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 border">#</th>
                      <th className="p-3 border">المستخدم</th>
                      <th className="p-3 border">الحرفي</th>
                      <th className="p-3 border">التقييم</th>
                      <th className="p-3 border">الوصف</th>
                      <th className="p-3 border">التاريخ</th>
                      <th className="p-3 border">رقم الطلب</th>
                      <th className="p-3 border">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratings.map((rating, index) => (
                      <tr key={rating.id} className="hover:bg-gray-50">
                        <td className="p-3 border">{index + 1}</td>
                        <td className="p-3 border">{rating.userFullName}</td>
                        <td className="p-3 border">{rating.craftsmanFullName}</td>
                        <td className="p-3 border">
                          <div className="flex items-center justify-end">
                            <span className="ml-1">({rating.stars})</span>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${i < rating.stars ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 border">{rating.description || 'لا يوجد وصف'}</td>
                        <td className="p-3 border">{formatDate(rating.createdAt)}</td>
                        <td className="p-3 border">{rating.serviceRequestId}</td>
                        <td className="p-3 border">
                          <button
                            onClick={() => deleteRating(rating.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            حذف
                          </button>
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
    </div>
  );
};

export default Ratings;