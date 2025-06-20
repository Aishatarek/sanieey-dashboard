import React, { useState, useEffect } from "react";
import Card from "components/card";
import Swal from "sweetalert2";

const Profession = () => {
  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchProfessions = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://sani3ywebapiv1.runasp.net/api/Profession", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("فشل في جلب المهن");
      const data = await res.json();
      setProfessions(data);
    } catch (error) {
      console.error("خطأ في جلب المهن:", error);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء جلب المهن",
        confirmButtonText: "حسناً",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProfessions();
  }, [token]);

  const showAddModal = () => {
    Swal.fire({
      title: 'إضافة مهنة جديدة',
      html: `
        <div class="text-right">
          <input id="name" type="text" placeholder="اسم المهنة" class="swal2-input w-full text-right">
          <input id="image" type="file" accept="image/*" class="swal2-file mt-2">
          <div id="imagePreview" class="mt-2"></div>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = Swal.getPopup().querySelector('#name').value;
        const image = Swal.getPopup().querySelector('#image').files[0];
        
        if (!name.trim()) {
          Swal.showValidationMessage('اسم المهنة مطلوب');
          return false;
        }
        
        return { name, image };
      },
      didOpen: () => {
        const imageInput = Swal.getPopup().querySelector('#image');
        imageInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          const preview = Swal.getPopup().querySelector('#imagePreview');
          preview.innerHTML = '';
          
          if (file) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.className = 'h-20 w-20 object-cover rounded';
            preview.appendChild(img);
          }
        });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        createProfession(result.value);
      }
    });
  };

  const showEditModal = (prof) => {
    Swal.fire({
      title: 'تعديل المهنة',
      html: `
        <div class="text-right">
          <input id="name" type="text" placeholder="اسم المهنة" 
            value="${prof.name}" class="swal2-input w-full text-right">
          <input id="image" type="file" accept="image/*" class="swal2-file mt-2">
          <div id="imagePreview" class="mt-2">
            ${prof.imagePath ? 
              `<img src="https://sani3ywebapiv1.runasp.net${prof.imagePath}" 
                alt="${prof.name}" class="h-20 w-20 object-cover rounded">` : ''}
          </div>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = Swal.getPopup().querySelector('#name').value;
        const image = Swal.getPopup().querySelector('#image').files[0];
        
        if (!name.trim()) {
          Swal.showValidationMessage('اسم المهنة مطلوب');
          return false;
        }
        
        return { id: prof.id, name, image };
      },
      didOpen: () => {
        const imageInput = Swal.getPopup().querySelector('#image');
        imageInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          const preview = Swal.getPopup().querySelector('#imagePreview');
          
          if (file) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.className = 'h-20 w-20 object-cover rounded';
            preview.innerHTML = '';
            preview.appendChild(img);
          }
        });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        updateProfession(result.value);
      }
    });
  };

  const createProfession = async ({ name, image }) => {
    const formData = new FormData();
    formData.append("Name", name);
    if (image) {
      formData.append("ImagePath", image);
    }

    try {
      const res = await fetch("https://sani3ywebapiv1.runasp.net/api/Profession", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!res.ok) throw new Error("فشل في إنشاء المهنة");
      
      Swal.fire({
        icon: "success",
        title: "تم الإنشاء",
        text: "تم إنشاء المهنة بنجاح",
        confirmButtonText: "حسناً",
      });
      
      fetchProfessions();
    } catch (error) {
      console.error("خطأ في إنشاء المهنة:", error);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء إنشاء المهنة",
        confirmButtonText: "حسناً",
      });
    }
  };

  const updateProfession = async ({ id, name, image }) => {
    const formData = new FormData();
    formData.append("Name", name);
    if (image) {
      formData.append("ImagePath", image);
    }

    try {
      const res = await fetch(`https://sani3ywebapiv1.runasp.net/api/Profession/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!res.ok) throw new Error("فشل في تحديث المهنة");
      
      Swal.fire({
        icon: "success",
        title: "تم التحديث",
        text: "تم تحديث المهنة بنجاح",
        confirmButtonText: "حسناً",
      });
      
      fetchProfessions();
    } catch (error) {
      console.error("خطأ في تحديث المهنة:", error);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء تحديث المهنة",
        confirmButtonText: "حسناً",
      });
    }
  };

  const deleteProfession = async (id) => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استعادة هذه المهنة بعد الحذف!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`https://sani3ywebapiv1.runasp.net/api/Profession/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("فشل في حذف المهنة");
        Swal.fire({
          icon: "success",
          title: "تم الحذف",
          text: "تم حذف المهنة بنجاح",
          confirmButtonText: "حسناً",
        });
        fetchProfessions();
      } catch (error) {
        console.error("خطأ في حذف المهنة:", error);
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "حدث خطأ أثناء حذف المهنة",
          confirmButtonText: "حسناً",
        });
      }
    }
  };

  return (
    <div className="mt-5">
      <Card extra="w-full pb-10 p-4 h-full">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-navy-700 dark:text-white">المهن</h2>
          <button
            onClick={showAddModal}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            إضافة مهنة جديدة
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 py-2 px-4">المعرف</th>
                  <th className="border border-gray-300 py-2 px-4">الاسم</th>
                  <th className="border border-gray-300 py-2 px-4">الصورة</th>
                  <th className="border border-gray-300 py-2 px-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {professions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      لا توجد مهن مسجلة حالياً.
                    </td>
                  </tr>
                ) : (
                  professions.map((prof) => (
                    <tr key={prof.id} className="border border-gray-300 hover:bg-gray-50">
                      <td className="border border-gray-300 py-2 px-4">{prof.id}</td>
                      <td className="border border-gray-300 py-2 px-4">{prof.name}</td>
                      <td className="border border-gray-300 py-2 px-4">
                        {prof.imagePath && (
                          <img 
                            src={`https://sani3ywebapiv1.runasp.net${prof.imagePath}`} 
                            alt={prof.name} 
                            className="h-10 w-10 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="border border-gray-300 py-2 px-4">
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => showEditModal(prof)}
                            className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 transition-colors"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => deleteProfession(prof.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            حذف
                          </button>
                        </div>
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

export default Profession;