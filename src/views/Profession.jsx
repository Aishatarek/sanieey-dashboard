import React, { useState, useEffect } from "react";
import Card from "components/card";
import Swal from "sweetalert2";

const Profession = () => {
  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ id: 0, name: "" });
  const [editMode, setEditMode] = useState(false);

  const token = localStorage.getItem("token");

  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json-patch+json",
  };

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createProfession = async () => {
    if (!form.name.trim()) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "اسم المهنة مطلوب",
        confirmButtonText: "حسناً",
      });
      return;
    }
    try {
      const res = await fetch("https://sani3ywebapiv1.runasp.net/api/Profession", {
        method: "POST",
        headers,
        body: JSON.stringify({  Name: form.name }),
      });
      if (!res.ok) throw new Error("فشل في إنشاء المهنة");
      Swal.fire({
        icon: "success",
        title: "تم الإنشاء",
        text: "تم إنشاء المهنة بنجاح",
        confirmButtonText: "حسناً",
      });
      setForm({ id: 0, name: "" });
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

  const updateProfession = async () => {
    if (!form.name.trim()) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "اسم المهنة مطلوب",
        confirmButtonText: "حسناً",
      });
      return;
    }
    try {
      const res = await fetch(`https://sani3ywebapiv1.runasp.net/api/Profession/${form.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ id: form.id, name: form.name }),
      });
      if (!res.ok) throw new Error("فشل في تحديث المهنة");
      Swal.fire({
        icon: "success",
        title: "تم التحديث",
        text: "تم تحديث المهنة بنجاح",
        confirmButtonText: "حسناً",
      });
      setForm({ id: 0, name: "" });
      setEditMode(false);
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

  // بدء التحرير
  const editHandler = (prof) => {
    setForm({ id: prof.id, name: prof.name });
    setEditMode(true);
  };

  const cancelEdit = () => {
    setForm({ id: 0, name: "" });
    setEditMode(false);
  };

  return (
    <div className="mt-5">
      <Card extra="w-full pb-10 p-4 h-full">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-navy-700 dark:text-white">المهن</h2>
          <button
            onClick={() => {
              setForm({ id: 0, name: "" });
              setEditMode(false);
            }}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            مسح
          </button>
        </header>

        <div className="mb-6">
          <input
            type="text"
            name="name"
            placeholder="اسم المهنة"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded mr-2 w-full max-w-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
          />
          {editMode ? (
            <div className="flex space-x-2 space-x-reverse mt-2">
              <button
                onClick={updateProfession}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                تحديث
              </button>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
              >
                إلغاء
              </button>
            </div>
          ) : (
            <button
              onClick={createProfession}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors mt-2"
            >
              إضافة
            </button>
          )}
        </div>

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
                  <th className="border border-gray-300 py-2 px-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {professions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4">
                      لا توجد مهن مسجلة حالياً.
                    </td>
                  </tr>
                ) : (
                  professions.map((prof) => (
                    <tr key={prof.id} className="border border-gray-300 hover:bg-gray-50">
                      <td className="border border-gray-300 py-2 px-4">{prof.id}</td>
                      <td className="border border-gray-300 py-2 px-4">{prof.name}</td>
                      <td className="border border-gray-300 py-2 px-4">
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => editHandler(prof)}
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