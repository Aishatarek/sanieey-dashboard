import React, { useState, useEffect } from "react";
import Card from "components/card";
import Swal from "sweetalert2";

const Recommendation = () => {
  const [pendingRecommendations, setPendingRecommendations] = useState([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const showAlert = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonText: 'حسناً'
    });
  };

  const fetchPendingRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://sani3ywebapiv1.runasp.net/api/Recommendation/pending-recommendations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('فشل في جلب البيانات');
      }
      
      const data = await response.json();
      setPendingRecommendations(data);
    } catch (error) {
      console.error('خطأ في جلب التوصيات المعلقة:', error);
      showAlert('error', 'خطأ', 'حدث خطأ أثناء جلب التوصيات المعلقة');
    } finally {
      setLoading(false);
    }
  };

  const approveRecommendation = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'هل تريد الموافقة على هذه التوصية؟',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'نعم، أوافق',
        cancelButtonText: 'إلغاء',
        reverseButtons: true
      });
      
      if (result.isConfirmed) {
        const response = await fetch(`https://sani3ywebapiv1.runasp.net/api/Recommendation/approve/${id}`, { 
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('فشل في الموافقة على التوصية');
        }
        
        fetchPendingRecommendations();
        showAlert('success', 'تمت الموافقة', 'تمت الموافقة على التوصية بنجاح');
      }
    } catch (error) {
      console.error('خطأ في الموافقة على التوصية:', error);
      showAlert('error', 'خطأ', 'حدث خطأ أثناء الموافقة على التوصية');
    }
  };

  const rejectRecommendation = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'هل تريد رفض هذه التوصية؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم، ارفض',
        cancelButtonText: 'إلغاء',
        reverseButtons: true,
        confirmButtonColor: '#d33'
      });
      
      if (result.isConfirmed) {
        const response = await fetch(`https://sani3ywebapiv1.runasp.net/api/Recommendation/reject/${id}`, { 
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('فشل في رفض التوصية');
        }
        
        fetchPendingRecommendations();
        showAlert('success', 'تم الرفض', 'تم رفض التوصية بنجاح');
      }
    } catch (error) {
      console.error('خطأ في رفض التوصية:', error);
      showAlert('error', 'خطأ', 'حدث خطأ أثناء رفض التوصية');
    }
  };

  const showRecommendationDetails = (recommendation) => {
    Swal.fire({
      title: `تفاصيل التوصية #${recommendation.id}`,
      html: `
        <div class="text-right">
          <p><strong>اسم الحرفي:</strong> ${recommendation.craftsmanFirstName} ${recommendation.craftsmanLastName}</p>
          <p><strong>المحافظة:</strong> ${recommendation.governorate}</p>
          <p><strong>الموقع:</strong> ${recommendation.location}</p>
          <p><strong>رقم الهاتف:</strong> ${recommendation.phoneNumber}</p>
          <p><strong>الحرفة:</strong> ${recommendation.professionName}</p>
          <p><strong>وصف العمل السابق:</strong> ${recommendation.previousWorkDescription}</p>
          <p><strong>تاريخ انتهاء المشروع:</strong> ${new Date(recommendation.dateTheProjectDone).toLocaleDateString()}</p>
          
          ${recommendation.previousWorkPicturePaths && recommendation.previousWorkPicturePaths.length > 0 ? `
            <div class="mt-3">
              <strong>صور العمل السابق:</strong>
              <div class="grid grid-cols-2 gap-2 mt-2">
                ${recommendation.previousWorkPicturePaths.map(img => `
                  <img src="https://sani3ywebapiv1.runasp.net${img}" class="w-full h-24 object-cover rounded border" />
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `,
      width: '800px',
      showConfirmButton: false,
      showCloseButton: true
    });
  };

  useEffect(() => {
    fetchPendingRecommendations();
  }, []);

  return (
    <div className="mt-5">
      <Card extra={"w-full p-4"}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">إدارة التوصيات</h1>
          <button 
            onClick={fetchPendingRecommendations}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            تحديث البيانات
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {pendingRecommendations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد توصيات معلقة حالياً</p>
            ) : (
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border">#</th>
                    <th className="p-3 border">اسم الحرفي</th>
                    <th className="p-3 border">الحرفة</th>
                    <th className="p-3 border">المحافظة</th>
                    <th className="p-3 border">رقم الهاتف</th>
                    <th className="p-3 border">الحالة</th>
                    <th className="p-3 border">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRecommendations.map((recommendation) => (
                    <tr key={recommendation.id} className="hover:bg-gray-50">
                      <td className="p-3 border">{recommendation.id}</td>
                      <td className="p-3 border">{recommendation.craftsmanFirstName} {recommendation.craftsmanLastName}</td>
                      <td className="p-3 border">{recommendation.professionName}</td>
                      <td className="p-3 border">{recommendation.governorate}</td>
                      <td className="p-3 border">{recommendation.phoneNumber}</td>
                      <td className="p-3 border">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          recommendation.status === 0 ? 'bg-yellow-100 text-yellow-800' : 
                          recommendation.status === 1 ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {recommendation.status === 0 ? 'معلقة' : recommendation.status === 1 ? 'مقبولة' : 'مرفوضة'}
                        </span>
                      </td>
                      <td className="p-3 border">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => showRecommendationDetails(recommendation)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            التفاصيل
                          </button>
                          <button
                            onClick={() => approveRecommendation(recommendation.id)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                          >
                            قبول
                          </button>
                          <button
                            onClick={() => rejectRecommendation(recommendation.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            رفض
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Recommendation;