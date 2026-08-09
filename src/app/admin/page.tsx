/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { OrnamentalDivider, SectionReveal, JaaliOverlay } from '@/components/ornamental';

interface AnalyticsData {
  totalReservations: number;
  confirmedReservations: number;
  pendingReservations: number;
  cancelledReservations: number;
  totalRevenue: number;
  averagePartySize: number;
  menuItems: number;
  queueItems: number;
  peakHours: { hour: number; count: number }[];
  reservationsByStatus: { status: string; count: number }[];
  dailyRevenue: { date: string; revenue: number }[];
}

interface MenuItem {
  id: string;
  name: string;
  hindiName?: string;
  description?: string;
  price: number;
  category: string;
  section?: string;
  context?: string;
  imageType?: string;
  imageUrl?: string;
  imageAlt?: string;
  includedItems?: string;
  availability?: string;
  isSignature?: boolean;
}

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  sortOrder: number;
  isPublished: boolean;
}

interface Reservation {
  id: string;
  reservationId: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  timeSlot: string;
  partySize: number;
  tableInfo?: string;
  status: string;
  emailStatus?: string;
  createdAt: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'menu' | 'menu-images' | 'gallery' | 'reservations'>('analytics');

  const [newItem, setNewItem] = useState({ name: '', hindiName: '', description: '', price: 0, category: 'Main Course', context: 'dine-in', includedItems: '', availability: 'daily', isSignature: false });

  // Menu Images CMS state
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilterCat, setMenuFilterCat] = useState('all');
  const [uploadingMenuId, setUploadingMenuId] = useState<string | null>(null);
  const [menuMessage, setMenuMessage] = useState<{ id: string; text: string; type: 'success' | 'error' } | null>(null);

  // Gallery CMS state
  const [newGallery, setNewGallery] = useState({ title: '', description: '', imageUrl: '', imageAlt: '', category: 'food', sortOrder: 0, isPublished: true });
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryMessage, setGalleryMessage] = useState<string | null>(null);

  // Staff verification state
  const [verifyId, setVerifyId] = useState('');
  const [verifyResult, setVerifyResult] = useState<Reservation | null>(null);
  const [verifyError, setVerifyError] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch { /* empty */ }
  }, []);

  const fetchMenu = useCallback(async () => {
    try {
      setMenuError(null);
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unable to load menu items. Check database connection.');
      }
      setMenuItems(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to load menu items. Check database connection.';
      setMenuError(message);
      setMenuItems([]);
    }
  }, []);

  const fetchGallery = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/gallery');
      const data = await res.json();
      setGalleryImages(Array.isArray(data) ? data : []);
    } catch { /* empty */ }
  }, []);

  const fetchReservations = useCallback(async () => {
    try {
      const res = await fetch('/api/reservation');
      const data = await res.json();
      setReservations(Array.isArray(data) ? data : []);
    } catch { /* empty */ }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAnalytics();
      fetchMenu();
      fetchGallery();
      fetchReservations();
    }
  }, [status, fetchAnalytics, fetchMenu, fetchGallery, fetchReservations]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-black">
        <p className="text-brass font-serif text-lg">Loading Admin Portal...</p>
      </div>
    );
  }

  if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative bg-warm-black">
        <JaaliOverlay opacity={0.015} />
        <GlassCard className="max-w-md w-full p-10 text-center relative z-10 border-brass/20">
          <div className="w-12 h-12 mx-auto mb-6 border border-brass/55 rotate-45 flex items-center justify-center">
            <span className="text-brass font-serif text-sm -rotate-45 font-semibold">CJ</span>
          </div>
          <h2 className="text-2xl font-serif text-ivory mb-2">Admin Authentication</h2>
          <p className="text-ivory/70 text-sm font-body mb-8">Please sign in as administrator to access the CMS and management portal.</p>
          <AnimatedButton
            onClick={() => signIn('credentials', { email: 'admin@chokhojeeman.com', password: 'admin', callbackUrl: '/admin' })}
            className="w-full"
          >
            Sign In as Admin
          </AnimatedButton>
        </GlassCard>
      </div>
    );
  }

  const addMenuItem = async () => {
    if (!newItem.name) return;
    try {
      await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      setNewItem({ name: '', hindiName: '', description: '', price: 0, category: 'Main Course', context: 'dine-in', includedItems: '', availability: 'daily', isSignature: false });
      fetchMenu();
    } catch { /* empty */ }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      await fetch(`/api/menu?id=${id}`, { method: 'DELETE' });
      fetchMenu();
    } catch { /* empty */ }
  };

  // Menu Image Upload Handler
  const handleMenuImageUpload = async (item: MenuItem, file: File) => {
    setUploadingMenuId(item.id);
    setMenuMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Upload failed');
      }

      const updateRes = await fetch('/api/admin/menu-images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          imageUrl: uploadData.url,
          imageAlt: item.name,
        }),
      });

      if (!updateRes.ok) {
        throw new Error('Failed to update menu item image');
      }

      setMenuMessage({ id: item.id, text: 'Image uploaded successfully!', type: 'success' });
      fetchMenu();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error uploading image';
      setMenuMessage({ id: item.id, text: message, type: 'error' });
    } finally {
      setUploadingMenuId(null);
    }
  };

  const handleMenuImageRemove = async (item: MenuItem) => {
    setUploadingMenuId(item.id);
    try {
      const updateRes = await fetch('/api/admin/menu-images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          imageUrl: null,
          imageAlt: null,
        }),
      });

      if (!updateRes.ok) throw new Error('Failed to remove image');

      setMenuMessage({ id: item.id, text: 'Image removed successfully', type: 'success' });
      fetchMenu();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error removing image';
      setMenuMessage({ id: item.id, text: message, type: 'error' });
    } finally {
      setUploadingMenuId(null);
    }
  };

  // Gallery CMS Handlers
  const handleGalleryUpload = async (file: File) => {
    setGalleryUploading(true);
    setGalleryMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setNewGallery(prev => ({ ...prev, imageUrl: data.url }));
      setGalleryMessage('Image uploaded. Complete details and click Add.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gallery image upload failed';
      setGalleryMessage(message);
    } finally {
      setGalleryUploading(false);
    }
  };

  const addGalleryItem = async () => {
    if (!newGallery.title || !newGallery.imageUrl) return;
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newGallery,
          imageAlt: newGallery.imageAlt || newGallery.title,
        }),
      });
      if (!res.ok) throw new Error('Failed to create gallery item');
      setNewGallery({ title: '', description: '', imageUrl: '', imageAlt: '', category: 'food', sortOrder: 0, isPublished: true });
      setGalleryMessage('Gallery item added successfully!');
      fetchGallery();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error adding gallery item';
      setGalleryMessage(message);
    }
  };

  const toggleGalleryPublish = async (img: GalleryImage) => {
    try {
      await fetch(`/api/admin/gallery/${img.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !img.isPublished }),
      });
      fetchGallery();
    } catch { /* empty */ }
  };

  const deleteGalleryItem = async (id: string) => {
    try {
      await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      fetchGallery();
    } catch { /* empty */ }
  };

  // Reservation operational actions
  const updateReservationStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/reservation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      fetchReservations();
      fetchAnalytics();
      if (verifyResult && verifyResult.id === id) {
        setVerifyResult(prev => prev ? { ...prev, status } : null);
      }
    } catch { /* empty */ }
  };

  const verifyReservationId = async () => {
    if (!verifyId.trim()) return;
    setVerifyLoading(true);
    setVerifyError('');
    setVerifyResult(null);
    try {
      const res = await fetch(`/api/reservation/verify?reservationId=${encodeURIComponent(verifyId.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Reservation not found');
      }
      setVerifyResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Reservation not found';
      setVerifyError(message);
    } finally {
      setVerifyLoading(false);
    }
  };

  const tabs = [
    { key: 'analytics', label: 'Analytics' },
    { key: 'menu', label: 'Menu CMS' },
    { key: 'menu-images', label: 'Menu Images' },
    { key: 'gallery', label: 'Gallery CMS' },
    { key: 'reservations', label: 'Reservations' },
  ] as const;

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) || (item.hindiName && item.hindiName.includes(menuSearch));
    const matchesCat = menuFilterCat === 'all' || item.category === menuFilterCat;
    return matchesSearch && matchesCat;
  });

  const menuCategories = ['all', ...Array.from(new Set(menuItems.map(i => i.category)))];

  return (
    <div className="relative min-h-screen">
      <JaaliOverlay opacity={0.015} />
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <SectionReveal>
          <div className="text-center mb-12">
            <p className="text-brass/70 uppercase tracking-[0.3em] text-xs mb-5 font-body font-semibold">Administration</p>
            <h1 className="text-4xl md:text-6xl font-serif text-ivory mb-4">Admin Dashboard</h1>
            <OrnamentalDivider variant="short" className="mt-6" />
          </div>
        </SectionReveal>

        <div className="flex gap-2 mb-10 flex-wrap justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2.5 rounded-sm text-[11px] uppercase tracking-[0.2em] font-body transition-all duration-500 font-semibold ${
                activeTab === tab.key
                  ? 'bg-brass/90 text-warm-black shadow-[0_2px_12px_rgba(181,144,60,0.25)]'
                  : 'bg-warm-mid/50 border border-brass/15 text-ivory/70 hover:bg-warm-mid hover:text-ivory hover:border-brass/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Reservations', value: analytics?.totalReservations ?? reservations.length },
                { label: 'Confirmed', value: analytics?.confirmedReservations ?? reservations.filter(r => r.status === 'BOOKED' || r.status === 'CONFIRMED').length },
                { label: 'Menu Items', value: analytics?.menuItems ?? menuItems.length },
                { label: 'Queue Length', value: analytics?.queueItems ?? 0 },
              ].map((stat) => (
                <GlassCard key={stat.label} className="p-6 text-center">
                  <p className="text-3xl font-serif text-brass">{stat.value}</p>
                  <p className="text-[10px] text-ivory/70 uppercase tracking-[0.2em] mt-2 font-body font-semibold">{stat.label}</p>
                </GlassCard>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-7">
                <h3 className="text-sm font-serif text-ivory/90 mb-5 uppercase tracking-[0.15em] font-semibold">Reservations by Status</h3>
                <div className="space-y-4">
                  {[
                    { status: 'BOOKED', count: reservations.filter(r => r.status === 'BOOKED').length },
                    { status: 'COMPLETED', count: reservations.filter(r => r.status === 'COMPLETED').length },
                    { status: 'CANCELLED', count: reservations.filter(r => r.status === 'CANCELLED').length },
                  ].map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <span className="text-ivory/75 text-sm font-body font-medium">{item.status}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-warm-dark/60 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-brass"
                            style={{ width: `${reservations.length ? (item.count / reservations.length) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-ivory/80 text-sm w-8 text-right font-body font-semibold">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-7">
                <h3 className="text-sm font-serif text-ivory/90 mb-5 uppercase tracking-[0.15em] font-semibold">Peak Hours</h3>
                <div className="space-y-4">
                  {(analytics?.peakHours ?? []).slice(0, 5).map((item) => (
                    <div key={item.hour} className="flex items-center justify-between">
                      <span className="text-ivory/75 text-sm font-body font-medium">{item.hour}:00</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-warm-dark/60 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-brass"
                            style={{ width: `${(item.count / Math.max(...(analytics?.peakHours ?? [{ count: 1 }]).map(p => p.count), 1)) * 100}%` }}
                          />
                        </div>
                        <span className="text-ivory/80 text-sm w-8 text-right font-body font-semibold">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {/* Menu CMS Tab */}
        {activeTab === 'menu' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <GlassCard className="p-7 mb-6">
              <h3 className="text-sm font-serif text-ivory/90 mb-5 uppercase tracking-[0.15em] font-semibold">Add Menu Item</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <input placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="px-4 py-2.5 rounded-sm bg-warm-dark/80 border border-brass/15 text-ivory placeholder-ivory/40 focus:outline-none focus:border-brass/50 transition-colors font-body text-sm" />
                <input placeholder="Hindi Name" value={newItem.hindiName} onChange={(e) => setNewItem({ ...newItem, hindiName: e.target.value })}
                  className="px-4 py-2.5 rounded-sm bg-warm-dark/80 border border-brass/15 text-ivory placeholder-ivory/40 focus:outline-none focus:border-brass/50 transition-colors font-body text-sm" />
                <input type="number" placeholder="Price" value={newItem.price || ''} onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                  className="px-4 py-2.5 rounded-sm bg-warm-dark/80 border border-brass/15 text-ivory placeholder-ivory/40 focus:outline-none focus:border-brass/50 transition-colors font-body text-sm" />
                <select value={newItem.context} onChange={(e) => setNewItem({ ...newItem, context: e.target.value })}
                  className="px-4 py-2.5 rounded-sm bg-warm-dark/80 border border-brass/15 text-ivory focus:outline-none focus:border-brass/50 transition-colors font-body text-sm">
                  <option value="dine-in">Dine-In</option>
                  <option value="takeaway">Takeaway</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <input placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="px-4 py-2.5 rounded-sm bg-warm-dark/80 border border-brass/15 text-ivory placeholder-ivory/40 focus:outline-none focus:border-brass/50 transition-colors font-body text-sm" />
                <input placeholder="Included Items (comma-separated)" value={newItem.includedItems} onChange={(e) => setNewItem({ ...newItem, includedItems: e.target.value })}
                  className="px-4 py-2.5 rounded-sm bg-warm-dark/80 border border-brass/15 text-ivory placeholder-ivory/40 focus:outline-none focus:border-brass/50 transition-colors font-body text-sm" />
                <select value={newItem.availability} onChange={(e) => setNewItem({ ...newItem, availability: e.target.value })}
                  className="px-4 py-2.5 rounded-sm bg-warm-dark/80 border border-brass/15 text-ivory focus:outline-none focus:border-brass/50 transition-colors font-body text-sm">
                  <option value="daily">Daily</option>
                  <option value="weekend-only">Weekend Only</option>
                </select>
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-sm bg-warm-dark/80 border border-brass/15">
                  <input type="checkbox" id="isSignature" checked={newItem.isSignature} onChange={(e) => setNewItem({ ...newItem, isSignature: e.target.checked })}
                    className="accent-[#b5903c]" />
                  <label htmlFor="isSignature" className="text-ivory/80 text-sm font-body">Signature Item</label>
                </div>
              </div>
              <div className="flex justify-end">
                <AnimatedButton onClick={addMenuItem}>Add Item</AnimatedButton>
              </div>
            </GlassCard>

            <GlassCard className="p-7">
              <h3 className="text-sm font-serif text-ivory/90 mb-5 uppercase tracking-[0.15em] font-semibold">Menu Items ({menuItems.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-sandstone uppercase tracking-wider text-[10px] border-b border-brass/10 font-body font-semibold">
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">Hindi</th>
                      <th className="pb-3 pr-4">Category</th>
                      <th className="pb-3 pr-4">Context</th>
                      <th className="pb-3 pr-4">Price</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr key={item.id} className="border-b border-brass/5">
                        <td className="py-3 pr-4 text-ivory font-body font-medium">{item.name}</td>
                        <td className="py-3 pr-4 text-ivory/70 font-body">{item.hindiName || '—'}</td>
                        <td className="py-3 pr-4 text-ivory/70 font-body">{item.category}</td>
                        <td className="py-3 pr-4 text-ivory/70 font-body">{item.context || '—'}</td>
                        <td className="py-3 pr-4 text-brass font-body font-semibold">₹{item.price}</td>
                        <td className="py-3">
                          <button onClick={() => deleteMenuItem(item.id)} className="text-red-400 hover:text-red-300 text-xs transition-colors font-body font-medium">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {menuItems.length === 0 && <p className="text-ivory/60 text-center py-6 font-body text-sm">No menu items yet.</p>}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Menu Images CMS Tab */}
        {activeTab === 'menu-images' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <GlassCard className="p-7 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif text-ivory font-semibold">Menu Images CMS ({menuItems.length} items)</h3>
                  <p className="text-ivory/70 text-xs font-body mt-1">Manage custom high-priority photographs for every menu item.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <input
                    placeholder="Search menu item..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="px-4 py-2 rounded-sm bg-warm-dark/80 border border-brass/15 text-ivory placeholder-ivory/40 text-sm font-body w-full sm:w-64"
                  />
                  <select
                    value={menuFilterCat}
                    onChange={(e) => setMenuFilterCat(e.target.value)}
                    className="px-4 py-2 rounded-sm bg-warm-dark/80 border border-brass/15 text-ivory text-sm font-body"
                  >
                    {menuCategories.map(cat => (
                      <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>
            </GlassCard>

            {menuError && (
              <GlassCard className="p-10 text-center mb-6 border-red-500/30 bg-red-500/5">
                <p className="text-red-400 font-body text-sm">{menuError}</p>
              </GlassCard>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map(item => {
                const msg = menuMessage?.id === item.id ? menuMessage : null;
                const isUploading = uploadingMenuId === item.id;
                return (
                  <GlassCard key={item.id} className="p-5 flex flex-col justify-between border-brass/15">
                    <div>
                      <div className="relative aspect-[4/3] rounded-sm overflow-hidden mb-4 bg-warm-dark/80 border border-brass/15">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-warm-dark/60">
                            <span className="text-ivory/70 text-xs font-body italic font-medium">Using Fallback Photo</span>
                            <span className="text-[10px] text-brass font-body uppercase tracking-wider mt-1 font-semibold">FOOD_IMAGES Fallback</span>
                          </div>
                        )}
                        {item.imageUrl ? (
                          <span className="absolute top-2 left-2 bg-green-500 text-warm-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-body font-bold shadow">
                            CUSTOM
                          </span>
                        ) : (
                          <span className="absolute top-2 left-2 bg-warm-black/80 text-ivory/80 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-body font-semibold">
                            FALLBACK
                          </span>
                        )}
                        {item.isSignature && (
                          <span className="absolute top-2 right-2 bg-brass text-warm-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-body font-bold">
                            Signature
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-ivory text-base font-semibold">{item.name}</h4>
                      <p className="text-ivory/70 text-sm font-body">{item.hindiName || '—'}</p>
                      <p className="text-brass font-serif text-sm mt-1 font-semibold">₹{item.price} <span className="text-ivory/60 text-xs font-body font-normal">({item.category})</span></p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-brass/15">
                      {msg && (
                        <p className={`text-xs mb-2 font-body font-medium ${msg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                          {msg.text}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <label className="flex-1 cursor-pointer bg-warm-mid hover:bg-warm-mid/80 border border-brass/30 text-ivory text-xs py-2 px-3 rounded text-center transition-colors font-body font-medium">
                          {isUploading ? 'Uploading...' : item.imageUrl ? 'Replace Image' : 'Upload Image'}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            disabled={isUploading}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleMenuImageUpload(item, file);
                            }}
                          />
                        </label>
                        {item.imageUrl && (
                          <button
                            onClick={() => handleMenuImageRemove(item)}
                            disabled={isUploading}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs py-2 px-3 rounded border border-red-500/30 transition-colors font-body font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
            {filteredMenuItems.length === 0 && !menuError && (
              <GlassCard className="p-10 text-center">
                <p className="text-ivory/70 font-body text-sm">No menu items match your search criteria.</p>
              </GlassCard>
            )}
          </motion.div>
        )}

        {/* Gallery CMS Tab */}
        {activeTab === 'gallery' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <GlassCard className="p-7 mb-8">
              <h3 className="text-sm font-serif text-ivory/90 mb-5 uppercase tracking-[0.15em] font-semibold">Add Gallery Image</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <input
                  placeholder="Title"
                  value={newGallery.title}
                  onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                  className="px-4 py-2.5 rounded-sm bg-warm-dark/80 border border-brass/15 text-ivory placeholder-ivory/40 text-sm font-body"
                />
                <input
                  placeholder="Category (e.g. food, ambiance)"
                  value={newGallery.category}
                  onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}
                  className="px-4 py-2.5 rounded-sm bg-warm-dark/80 border border-brass/15 text-ivory placeholder-ivory/40 text-sm font-body"
                />
                <input
                  placeholder="Alt Text"
                  value={newGallery.imageAlt}
                  onChange={(e) => setNewGallery({ ...newGallery, imageAlt: e.target.value })}
                  className="px-4 py-2.5 rounded-sm bg-warm-dark/80 border border-brass/15 text-ivory placeholder-ivory/40 text-sm font-body"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input
                  placeholder="Description (optional)"
                  value={newGallery.description}
                  onChange={(e) => setNewGallery({ ...newGallery, description: e.target.value })}
                  className="px-4 py-2.5 rounded-sm bg-warm-dark/80 border border-brass/15 text-ivory placeholder-ivory/40 text-sm font-body"
                />
                <div className="flex gap-3 items-center">
                  <label className="flex-1 cursor-pointer bg-warm-mid hover:bg-warm-mid/80 border border-brass/30 text-ivory text-xs py-2.5 px-4 rounded text-center transition-colors font-body font-medium">
                    {galleryUploading ? 'Uploading...' : newGallery.imageUrl ? 'Image Selected ✓' : 'Upload Image File'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleGalleryUpload(file);
                      }}
                    />
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={newGallery.isPublished}
                      onChange={(e) => setNewGallery({ ...newGallery, isPublished: e.target.checked })}
                      className="accent-[#b5903c]"
                    />
                    <label htmlFor="isPublished" className="text-ivory/80 text-xs font-body font-medium">Published</label>
                  </div>
                </div>
              </div>
              {galleryMessage && (
                <p className="text-xs text-brass mb-4 font-body font-semibold">{galleryMessage}</p>
              )}
              <div className="flex justify-end">
                <AnimatedButton onClick={addGalleryItem}>Add Gallery Image</AnimatedButton>
              </div>
            </GlassCard>

            <GlassCard className="p-7">
              <h3 className="text-sm font-serif text-ivory/90 mb-5 uppercase tracking-[0.15em] font-semibold">Gallery Management ({galleryImages.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((img) => (
                  <div key={img.id} className="bg-warm-dark/60 border border-brass/15 rounded-lg overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-[4/3]">
                        <Image src={img.imageUrl} alt={img.imageAlt} fill className="object-cover" />
                        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] uppercase font-body font-bold ${img.isPublished ? 'bg-green-500 text-warm-black' : 'bg-warm-black/90 text-ivory/80'}`}>
                          {img.isPublished ? 'Published' : 'Unpublished'}
                        </span>
                      </div>
                      <div className="p-4">
                        <h4 className="font-serif text-ivory font-semibold">{img.title}</h4>
                        <p className="text-brass/80 text-xs uppercase tracking-wider font-body mt-0.5 font-medium">{img.category}</p>
                        {img.description && <p className="text-ivory/70 text-xs font-body mt-2">{img.description}</p>}
                      </div>
                    </div>
                    <div className="p-4 pt-0 flex items-center justify-between border-t border-brass/10">
                      <button
                        onClick={() => toggleGalleryPublish(img)}
                        className={`text-xs px-3 py-1.5 rounded font-body font-medium transition-colors ${img.isPublished ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'}`}
                      >
                        {img.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => deleteGalleryItem(img.id)}
                        className="text-red-400 hover:text-red-300 text-xs font-body font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {galleryImages.length === 0 && (
                <p className="text-ivory/60 text-center py-6 font-body text-sm">No gallery images found.</p>
              )}
            </GlassCard>
          </motion.div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Staff Arrival Verification Card */}
            <GlassCard className="p-7 mb-8 border-brass/20">
              <h3 className="text-sm font-serif text-brass mb-3 uppercase tracking-[0.15em] font-semibold">Staff Arrival Verification</h3>
              <p className="text-ivory/70 text-xs font-body mb-5 font-medium">Enter customer Reservation ID to check-in and mark as completed upon arrival.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  placeholder="Enter Reservation ID (e.g. CJ-2026-8F4K2M)"
                  value={verifyId}
                  onChange={(e) => setVerifyId(e.target.value)}
                  className="px-4 py-2.5 rounded-sm bg-warm-dark/80 border border-brass/15 text-ivory placeholder-ivory/40 text-sm font-body flex-1"
                />
                <AnimatedButton onClick={verifyReservationId} disabled={verifyLoading || !verifyId.trim()}>
                  {verifyLoading ? 'Verifying...' : 'Verify ID'}
                </AnimatedButton>
              </div>

              {verifyError && (
                <p className="text-xs text-red-400 mt-3 font-body font-medium">{verifyError}</p>
              )}

              {verifyResult && (
                <div className="mt-5 p-5 bg-warm-dark/80 rounded border border-brass/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-brass font-mono uppercase tracking-wider font-semibold">Valid Reservation</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold font-body ${verifyResult.status === 'COMPLETED' ? 'bg-green-500 text-warm-black' : 'bg-brass text-warm-black'}`}>
                      {verifyResult.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-body">
                    <p className="text-ivory/90"><strong className="text-sandstone">ID:</strong> {verifyResult.reservationId}</p>
                    <p className="text-ivory/90"><strong className="text-sandstone">Name:</strong> {verifyResult.name}</p>
                    <p className="text-ivory/90"><strong className="text-sandstone">Date:</strong> {new Date(verifyResult.date).toLocaleDateString()}</p>
                    <p className="text-ivory/90"><strong className="text-sandstone">Time:</strong> {verifyResult.timeSlot}</p>
                    <p className="text-ivory/90"><strong className="text-sandstone">Party Size:</strong> {verifyResult.partySize} guests</p>
                    {verifyResult.tableInfo && <p className="text-ivory/90"><strong className="text-sandstone">Table:</strong> {verifyResult.tableInfo}</p>}
                  </div>
                  {verifyResult.status !== 'COMPLETED' && (
                    <div className="pt-3 border-t border-brass/15 flex justify-end">
                      <AnimatedButton onClick={() => updateReservationStatus(verifyResult.id, 'COMPLETED')}>
                        Mark Completed (Check-In)
                      </AnimatedButton>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>

            {/* All Reservations List */}
            <GlassCard className="p-7">
              <h3 className="text-sm font-serif text-ivory/90 mb-5 uppercase tracking-[0.15em] font-semibold">All Reservations ({reservations.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                      <tr className="text-left text-sandstone uppercase tracking-wider text-[10px] border-b border-brass/10 font-body font-semibold">
                        <th className="pb-3 pr-4">ID</th>
                        <th className="pb-3 pr-4">Guest</th>
                        <th className="pb-3 pr-4">Date & Time</th>
                        <th className="pb-3 pr-4">Party</th>
                        <th className="pb-3 pr-4">Status</th>
                        <th className="pb-3 pr-4">Email Status</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr key={r.id} className="border-b border-brass/5">
                        <td className="py-3 pr-4 text-brass font-mono text-xs font-semibold">{r.reservationId}</td>
                        <td className="py-3 pr-4">
                          <p className="text-ivory font-body font-medium">{r.name}</p>
                          <p className="text-ivory/70 text-xs font-body">{r.email}</p>
                        </td>
                        <td className="py-3 pr-4 text-ivory/80 font-body text-xs">
                          {new Date(r.date).toLocaleDateString()} @ {r.timeSlot}
                        </td>
                        <td className="py-3 pr-4 text-ivory/80 font-body font-medium">{r.partySize}</td>
                        <td className="py-3 pr-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-body ${r.status === 'COMPLETED' ? 'bg-green-500 text-warm-black' : r.status === 'CANCELLED' ? 'bg-red-500 text-ivory' : 'bg-brass text-warm-black'}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold font-body ${r.emailStatus === 'SENT' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : r.emailStatus === 'FAILED' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'}`}>
                              {r.emailStatus || 'PENDING'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 flex items-center gap-3">
                          {r.status !== 'COMPLETED' && (
                            <button onClick={() => updateReservationStatus(r.id, 'COMPLETED')} className="text-green-400 hover:text-green-300 text-xs font-body font-medium transition-colors">
                              Complete
                            </button>
                          )}
                          {r.status !== 'CANCELLED' && (
                            <button onClick={() => updateReservationStatus(r.id, 'CANCELLED')} className="text-red-400 hover:text-red-300 text-xs font-body font-medium transition-colors">
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {reservations.length === 0 && (
                  <p className="text-ivory/60 text-center py-6 font-body text-sm">No reservations found.</p>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
