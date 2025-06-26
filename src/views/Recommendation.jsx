import React, { useState, useEffect } from "react";
import Card from "components/card";
import Swal from "sweetalert2";

const Recommendation = () => {
  const [pendingRecommendations, setPendingRecommendations] = useState([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [professions, setProfessions] = useState([]);
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Governorate: "",
    Location: "",
    ProfessionId: "",
    PhoneNumber: "",
    Email: "",
    Password: "",
    CardImage: null,
    ProfileImage: null
  });
  const token = localStorage.getItem("token");

  // جلب قائمة المهن من API
  useEffect(() => {
    async function fetchProfessions() {
      try {
        const res = await fetch(
          "https://sani3ywebapiv1.runasp.net/api/Profession"
        );
        const data = await res.json();
        setProfessions(data);
      } catch (error) {
        console.error("Failed to load professions:", error);
      }
    }
    fetchProfessions();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const submitCraftsmanForm = async (recommendationId) => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      
      // إضافة جميع الحقول إلى FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });
      
      const response = await fetch(`https://sani3ywebapiv1.runasp.net/api/Recommendation/add-craftsman/${recommendationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      
      if (!response.ok) {
        throw new Error('فشل في إضافة الحرفي');
      }
      
      setShowForm(false);
      fetchPendingRecommendations();
      showAlert('success', 'تمت الإضافة', 'تمت إضافة الحرفي بنجاح');
    } catch (error) {
      console.error('خطأ في إضافة الحرفي:', error);
      showAlert('error', 'خطأ', 'حدث خطأ أثناء إضافة الحرفي');
    } finally {
      setLoading(false);
    }
  };

  const showCraftsmanForm = (recommendation) => {
    setSelectedRecommendation(recommendation);
    // تعبئة البيانات الأساسية من التوصية
    setFormData({
      FirstName: recommendation.craftsmanFirstName,
      LastName: recommendation.craftsmanLastName,
      Governorate: recommendation.governorate,
      Location: recommendation.location,
      ProfessionId: recommendation.professionId,
      PhoneNumber: recommendation.phoneNumber,
      Email: "",
      Password: "",
      CardImage: null,
      ProfileImage: null
    });
    setShowForm(true);
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
        const recommendation = pendingRecommendations.find(r => r.id === id);
        showCraftsmanForm(recommendation);
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
              <>
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

                {/* نموذج إضافة الحرفي */}
                {showForm && selectedRecommendation && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">إضافة حرفي جديد</h2>
                        <button 
                          onClick={() => setShowForm(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          &times;
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-2 text-sm font-medium">الاسم الأول *</label>
                          <input
                            type="text"
                            name="FirstName"
                            value={formData.FirstName}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-2 text-sm font-medium">الاسم الأخير *</label>
                          <input
                            type="text"
                            name="LastName"
                            value={formData.LastName}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-2 text-sm font-medium">المحافظة *</label>
                          <input
                            type="text"
                            name="Governorate"
                            value={formData.Governorate}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-2 text-sm font-medium">الموقع *</label>
                          <input
                            type="text"
                            name="Location"
                            value={formData.Location}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-2 text-sm font-medium">الحرفة *</label>
                        
                          <select id="professionsList"      name="ProfessionId"      value={formData.ProfessionId}
                            onChange={handleInputChange}>
                            {professions.map(profession => (
                              <option key={profession.id} value={profession.id}>
                                {profession.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block mb-2 text-sm font-medium">رقم الهاتف *</label>
                          <input
                            type="text"
                            name="PhoneNumber"
                            value={formData.PhoneNumber}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-2 text-sm font-medium">البريد الإلكتروني *</label>
                          <input
                            type="email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-2 text-sm font-medium">كلمة المرور *</label>
                          <input
                            type="password"
                            name="Password"
                            value={formData.Password}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-2 text-sm font-medium">صورة البطاقة</label>
                          <input
                            type="file"
                            name="CardImage"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded"
                            accept="image/*"
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-2 text-sm font-medium">صورة الملف الشخصي</label>
                          <input
                            type="file"
                            name="ProfileImage"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded"
                            accept="image/*"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end gap-3">
                        <button
                          onClick={() => setShowForm(false)}
                          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                        >
                          إلغاء
                        </button>
                        <button
                          onClick={() => submitCraftsmanForm(selectedRecommendation.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                          disabled={loading}
                        >
                          {loading ? 'جاري الإضافة...' : 'إضافة الحرفي'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Recommendation;