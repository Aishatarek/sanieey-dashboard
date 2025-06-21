import React, { useState, useEffect } from "react";
import Card from "components/card";
import Swal from "sweetalert2";

const Verifications = () => {
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchPendingVerifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://sani3ywebapiv1.runasp.net/api/Verification/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('فشل في جلب طلبات التحقق');
      }
      
      const data = await response.json();
      setPendingVerifications(data);
    } catch (error) {
      console.error('خطأ في جلب طلبات التحقق:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء جلب طلبات التحقق',
        confirmButtonText: 'حسناً'
      });
    } finally {
      setLoading(false);
    }
  };

  const approveVerification = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'هل تريد الموافقة على طلب التحقق هذا؟',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'نعم، أوافق',
        cancelButtonText: 'إلغاء',
        reverseButtons: true
      });
      
      if (result.isConfirmed) {
        const response = await fetch(`https://sani3ywebapiv1.runasp.net/api/Verification/approve/${id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('فشل في الموافقة على طلب التحقق');
        }
        
        fetchPendingVerifications();
        Swal.fire({
          icon: 'success',
          title: 'تمت الموافقة',
          text: 'تمت الموافقة على طلب التحقق بنجاح',
          confirmButtonText: 'حسناً'
        });
      }
    } catch (error) {
      console.error('خطأ في الموافقة على طلب التحقق:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء الموافقة على طلب التحقق',
        confirmButtonText: 'حسناً'
      });
    }
  };

  const rejectVerification = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'هل تريد رفض طلب التحقق هذا؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم، ارفض',
        cancelButtonText: 'إلغاء',
        reverseButtons: true,
        confirmButtonColor: '#d33'
      });
      
      if (result.isConfirmed) {
        const response = await fetch(`https://sani3ywebapiv1.runasp.net/api/Verification/reject/${id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('فشل في رفض طلب التحقق');
        }
        
        fetchPendingVerifications();
        Swal.fire({
          icon: 'success',
          title: 'تم الرفض',
          text: 'تم رفض طلب التحقق بنجاح',
          confirmButtonText: 'حسناً'
        });
      }
    } catch (error) {
      console.error('خطأ في رفض طلب التحقق:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء رفض طلب التحقق',
        confirmButtonText: 'حسناً'
      });
    }
  };

  const showVerificationDetails = (verification) => {
    Swal.fire({
      title: `تفاصيل طلب التحقق #${verification.id}`,
      html: `
        <div class="text-right space-y-3">
          <div class="flex justify-center">
            <img 
              src="${verification.profileImagePath ? `https://sani3ywebapiv1.runasp.net${verification.profileImagePath}` : '/img/default-profile.png'}" 
              alt="صورة الحرفي" 
              class="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
          
          <p><strong>اسم الحرفي:</strong> ${verification.fullName || 'غير متوفر'}</p>
          <p><strong>معرف الحرفي:</strong> ${verification.craftsmanId || 'غير متوفر'}</p>
          
          <div class="mt-4">
            <strong>صورة البطاقة الشخصية:</strong>
            <div class="mt-2">
              <img src="https://sani3ywebapiv1.runasp.net${verification.cardImagePath}" class="w-full h-48 object-contain bg-gray-100 rounded border" />
            </div>
          </div>
          
          <p class="mt-2"><strong>تاريخ التقديم:</strong> ${new Date(verification.submittedAt).toLocaleString()}</p>
        </div>
      `,
      width: '700px',
      showConfirmButton: false,
      showCloseButton: true
    });
  };

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  return (
    <div className="mt-5">
      <Card extra={"w-full p-4"}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">إدارة طلبات التحقق</h1>
          <button 
            onClick={fetchPendingVerifications}
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
          <div className="overflow-x-auto">
            {pendingVerifications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد طلبات تحقق معلقة حالياً</p>
            ) : (
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border">#</th>
                    <th className="p-3 border">الحرفي</th>
                    <th className="p-3 border">معرف الحرفي</th>
                    <th className="p-3 border">تاريخ التقديم</th>
                    <th className="p-3 border">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingVerifications.map((verification, index) => (
                    <tr key={verification.id} className="hover:bg-gray-50">
                      <td className="p-3 border">{index + 1}</td>
                      <td className="p-3 border">
                        <div className="flex items-center gap-2">
                          <img 
                            src={verification.profileImagePath ? `https://sani3ywebapiv1.runasp.net${verification.profileImagePath}` : '/img/default-profile.png'} 
                            alt="صورة الحرفي" 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          {verification.fullName}
                        </div>
                      </td>
                      <td className="p-3 border">{verification.craftsmanId}</td>
                      <td className="p-3 border">{new Date(verification.submittedAt).toLocaleDateString()}</td>
                      <td className="p-3 border">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => showVerificationDetails(verification)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            التفاصيل
                          </button>
                          <button
                            onClick={() => approveVerification(verification.id)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                          >
                            قبول
                          </button>
                          <button
                            onClick={() => rejectVerification(verification.id)}
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

export default Verifications;