import { useState, useEffect } from 'react';
import { api } from './services/api';
import type { Item, RentRequest, InventoryStats } from './types';
import { Search, MapPin, Ghost as Panda, Info, X, User, Navigation, ChevronLeft, ChevronRight, CheckCircle, List, Lock, LogOut, ShieldCheck, ShieldAlert } from 'lucide-react';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('sustainly_user') !== null);
  const [loginForm, setLoginForm] = useState({ username: localStorage.getItem('sustainly_user') || '', password: '' });
  const [view, setView] = useState<'browse' | 'requests'>('browse');
  const [items, setItems] = useState<Item[]>([]);
  const [myRequests, setMyRequests] = useState<RentRequest[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ category: '', location: '' });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [rentSuccess, setRentSuccess] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('sustainly_user', loginForm.username);
      loadData(0);
      setUserLocation({ lat: 53.3811, lon: -1.4701 });
    } else {
      localStorage.removeItem('sustainly_user');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (view === 'requests' && isLoggedIn) loadUserRequests();
  }, [view, isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'User001' && loginForm.password === 'pw123') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials! Try User001 / pw123');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('sustainly_user');
    setLoginForm({ username: '', password: '' });
  };

  const loadData = async (pageNum: number = 0) => {
    setLoading(true);
    try {
      const itemsRes = await api.getItems(search.category, search.location, pageNum, 12);
      const statsRes = await api.getInventoryStats();
      setItems(itemsRes.content || []);
      setTotalPages(itemsRes.totalPages || 0);
      setPage(pageNum);
      setStats(statsRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserRequests = async () => {
    setLoading(true);
    try {
      const res = await api.getUserRequests(loginForm.username);
      setMyRequests(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowInfo = async (item: Item) => {
    setRentSuccess(false);
    try {
      const detailedItem = await api.getItemById(item.id, userLocation?.lat, userLocation?.lon);
      setSelectedItem(detailedItem);
    } catch (err) {
      alert('Failed to load item details');
    }
  };

  const handleRent = async () => {
    if (!selectedItem || !selectedItem.available) return;
    try {
      await api.createRentRequest({
        renter_id: loginForm.username,
        item_id: selectedItem.item_id,
        owner_id: selectedItem.owner_id
      });
      setRentSuccess(true);
      setTimeout(() => {
        setSelectedItem(null);
        setView('requests');
      }, 2000);
    } catch (err) {
      alert('Failed to submit rent request');
    }
  };

  const getImageUrl = (category: string) => {
    const cat = (category || 'cycle').toLowerCase();
    if (cat.includes('fitness')) return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80';
    return 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80';
  };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ background: '#059669', borderRadius: '50%', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 20px' }}>
            <Panda size={40} />
          </div>
          <h1 style={{ color: '#059669', margin: '0 0 10px 0' }}>Sustainly</h1>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>Please login to access the equipment marketplace</p>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px', color: '#475569' }}>Username</label>
              <input 
                type='text' 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} 
                value={loginForm.username}
                onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                placeholder='User001'
              />
            </div>
            <div style={{ marginBottom: '25px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px', color: '#475569' }}>Password</label>
              <input 
                type='password' 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} 
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                placeholder='pw123'
              />
            </div>
            <button type='submit' style={{ width: '100%', padding: '12px', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Lock size={18} /> Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: '#333', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '20px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#059669', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Panda size={30} />
          </div>
          <h1 style={{ margin: 0, color: '#059669', fontSize: '28px' }}>Sustainly</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {stats && (
            <div style={{ fontSize: '13px', textAlign: 'right' }}>
              <div style={{ color: '#64748b' }}>{stats['Total items:']} Items</div>
              <div style={{ color: '#059669', fontWeight: 'bold' }}>{stats['Available items :']} Available</div>
            </div>
          )}
          <nav style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setView('browse')}
              style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: view === 'browse' ? '#059669' : 'transparent', color: view === 'browse' ? 'white' : '#64748b', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Browse
            </button>
            <button 
              onClick={() => setView('requests')}
              style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: view === 'requests' ? '#059669' : 'transparent', color: view === 'requests' ? 'white' : '#64748b', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <List size={18} /> My Requests
            </button>
          </nav>
          <div style={{ height: '24px', width: '1px', background: '#eee' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>{loginForm.username}</span>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px' }} title='Logout'>
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {view === 'browse' ? (
        <>
          <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '12px', marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap', border: '1px solid #dcfce7' }}>
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} size={20} />
              <input 
                placeholder='Filter by Category'
                style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                value={search.category}
                onChange={e => setSearch({...search, category: e.target.value})}
              />
            </div>
            <button onClick={() => loadData(0)} style={{ padding: '10px 25px', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Search
            </button>
          </div>

          {loading ? <p style={{ textAlign: 'center', padding: '40px' }}>Loading items...</p> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px', marginBottom: '40px' }}>
              {items.map(item => (
                <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: 'white' }}>
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                      <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>{item.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', background: item.available ? '#dcfce7' : '#fee2e2', color: item.available ? '#166534' : '#991b1b', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                        {item.available ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                        {item.available ? 'Available' : 'Rented'}
                      </div>
                    </div>
                    <p style={{ color: '#059669', fontSize: '14px', fontWeight: '600', marginBottom: '15px' }}>{item.category}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
                      <MapPin size={14} /> {item.location}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '18px' }}>£{item.daily_rate}/day</span>
                      <button 
                        onClick={() => handleShowInfo(item)} 
                        style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}
                      >
                        <Info size={16} /> Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '20px 0' }}>
              <button disabled={page === 0} onClick={() => loadData(page - 1)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', background: page === 0 ? '#f1f5f9' : 'white', cursor: page === 0 ? 'not-allowed' : 'pointer' }}>
                <ChevronLeft size={20} /> Prev
              </button>
              <span style={{ fontWeight: 'bold', color: '#64748b' }}>{page + 1} / {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => loadData(page + 1)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', background: page >= totalPages - 1 ? '#f1f5f9' : 'white', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}>
                Next <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '25px' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>My Rental Requests</h2>
          {loading ? <p>Loading requests...</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '14px' }}>
                  <th style={{ padding: '12px' }}>Request ID</th>
                  <th style={{ padding: '12px' }}>Item ID</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.map(req => (
                  <tr key={req.rent_id || Math.random()} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{req.rent_id || req.item_id.substring(0,5)}</td>
                    <td style={{ padding: '12px' }}>{req.item_id}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: req.status === 'pending' ? '#fef9c3' : '#dcfce7', color: req.status === 'pending' ? '#854d0e' : '#166534' }}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {myRequests.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>You haven't made any requests yet.</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      )}

      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', maxWidth: '600px', width: '100%', position: 'relative', overflow: 'hidden' }}>
            <button 
              onClick={() => setSelectedItem(null)}
              style={{ position: 'absolute', right: '15px', top: '15px', background: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
            >
              <X size={20} />
            </button>
            <img src={getImageUrl(selectedItem.category)} style={{ width: '100%', height: '250px', objectFit: 'cover' }} alt="Item" />
            <div style={{ padding: '25px' }}>
              {rentSuccess ? (
                <div style={{ textAlign: 'center', padding: '20px', background: '#dcfce7', color: '#166534', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                  <CheckCircle size={48} style={{ margin: '0 auto 10px' }} />
                  <p style={{ fontWeight: 'bold' }}>Rent request sent successfully! Please wait for updates.</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <h2 style={{ margin: '0' }}>{selectedItem.name}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', background: selectedItem.available ? '#dcfce7' : '#fee2e2', color: selectedItem.available ? '#166534' : '#991b1b', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                      {selectedItem.available ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                      {selectedItem.available ? 'Available' : 'Rented'}
                    </div>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>{selectedItem.description || "No detailed description available."}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                    <div style={{ border: '1px solid #eee', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', marginBottom: '4px' }}><User size={14}/> Owner</div>
                      <div style={{ fontWeight: 'bold' }}>{selectedItem.owner_id}</div>
                    </div>
                    <div style={{ border: '1px solid #eee', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', marginBottom: '4px' }}><Navigation size={14}/> Distance</div>
                      <div style={{ fontWeight: 'bold' }}>{selectedItem.distance ? (selectedItem.distance/1000).toFixed(2) + 'km' : 'Calculating...'}</div>
                    </div>
                  </div>
                  <button 
                    onClick={handleRent}
                    disabled={!selectedItem.available}
                    style={{ 
                      width: '100%', 
                      marginTop: '25px', 
                      padding: '15px', 
                      background: selectedItem.available ? '#059669' : '#94a3b8', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '10px', 
                      fontWeight: 'bold', 
                      cursor: selectedItem.available ? 'pointer' : 'not-allowed', 
                      fontSize: '16px',
                      opacity: selectedItem.available ? 1 : 0.7
                    }}
                  >
                    {selectedItem.available ? 'Rent This Now' : 'Item Already Rented'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
