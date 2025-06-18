import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCraftsmen: 0,
    totalOrders: 0,
    totalVisits: 0,
    loading: true,
    error: null
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsResponse = await axios.get('https://sani3ywebapiv1.runasp.net/api/Home/system-stats');
        
        const usersResponse = await axios.get('https://sani3ywebapiv1.runasp.net/api/UserManagement/all-users', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        
        setStats({
          totalUsers: usersResponse.data.length,
          totalCraftsmen: statsResponse.data.totalCraftsmen,
          totalOrders: statsResponse.data.totalOrders,
          totalVisits: 0,
          loading: false,
          error: null
        });
      } catch (error) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'فشل في تحميل الإحصائيات'
        }));
      }
    };

    fetchStats();
  }, []);

  // تهيئة StatCounter
  useEffect(() => {
    const sc_project = 13144200;
    const sc_invisible = 0;
    const sc_security = "b81ab679";
    const scJsHost = "https://";

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      var sc_project=${sc_project}; 
      var sc_invisible=${sc_invisible}; 
      var sc_security="${sc_security}";
      var scJsHost = "${scJsHost}";
    `;
    document.body.appendChild(script);

    const script2 = document.createElement('script');
    script2.src = scJsHost + 'statcounter.com/counter/counter.js';
    script2.async = true;
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(script2);
    };
  }, []);

  if (stats.loading) {
    return <div className="stats-loading">جاري تحميل الإحصائيات...</div>;
  }

  if (stats.error) {
    return <div className="stats-error">{stats.error}</div>;
  }

  return (
    <section className="statistics-section">
      <h2 className="section-title">إحصائيات الموقع</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalUsers}</div>
          <div className="stat-label">المستخدمين المسجلين</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats.totalCraftsmen}</div>
          <div className="stat-label">الصنايعية المهرة</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats.totalOrders}</div>
          <div className="stat-label">الطلبات المكتملة</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number text-center">
            <img
              className="statcounter-img"
              src={`https://c.statcounter.com/${13144200}/0/${"b81ab679"}/0/`}
              alt="Web Analytics"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="stat-label">زيارة للموقع</div>
        </div>
      </div>
    </section>
  );
};

export default Home;