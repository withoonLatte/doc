import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Save, Building2, MapPin, Phone, Mail, FileText, Upload, Users, Plus, Trash2, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Settings() {
  const { companyInfo, updateCompanyInfo } = useStore();
  const { allUsers, addUser, deleteUser, user: currentUser } = useAuth();
  const [formData, setFormData] = useState(companyInfo);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Staff form state
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    username: '',
    password: '',
    name: '',
    role: 'staff' as Role
  });

  useEffect(() => {
    setFormData(companyInfo);
  }, [companyInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      updateCompanyInfo(formData);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.username || !newStaff.password || !newStaff.name) return;
    
    addUser(newStaff);
    setNewStaff({ username: '', password: '', name: '', role: 'staff' });
    setShowStaffForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">ตั้งค่าระบบ</h1>
        <p className="text-slate-500 mt-1">
          จัดการข้อมูลบริษัทและพนักงานในระบบ
        </p>
      </div>

      {/* Company Info Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-8 space-y-8">
          {/* Logo Section */}
          <div>
            <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              โลโก้บริษัท
            </h3>
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 overflow-hidden relative group">
                {formData.logo ? (
                  <>
                    <img src={formData.logo} alt="Company Logo" className="w-full h-full object-contain p-2" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium">เปลี่ยนโลโก้</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <span className="text-xs text-slate-500">ยังไม่มีโลโก้</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 mb-2">
                  อัปโหลดโลโก้บริษัทของคุณเพื่อแสดงบนเอกสาร แนะนำให้ใช้ไฟล์ PNG หรือ JPG ที่มีพื้นหลังโปร่งใส ขนาดไม่เกิน 2MB
                </p>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium relative overflow-hidden"
                >
                  <Upload className="w-4 h-4" />
                  อัปโหลดรูปภาพ
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </button>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* General Info */}
          <div>
            <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              ข้อมูลทั่วไป
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  ชื่อบริษัท <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  เลขประจำตัวผู้เสียภาษี
                </label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  ที่อยู่
                </label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  อีเมล
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  เว็บไซต์
                </label>
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 p-6 sm:px-8 border-t border-slate-100 flex items-center justify-between">
          <div>
            {saveSuccess && (
              <span className="text-emerald-600 text-sm font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                บันทึกข้อมูลเรียบร้อยแล้ว
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-fuchsia-500 text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}</span>
          </button>
        </div>
      </form>

      {/* Staff Management Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              จัดการพนักงาน
            </h3>
            <button
              onClick={() => setShowStaffForm(!showStaffForm)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-sm font-bold"
            >
              <Plus className="w-4 h-4" />
              เพิ่มพนักงาน
            </button>
          </div>

          {showStaffForm && (
            <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-4">ข้อมูลพนักงานใหม่</h4>
              <form onSubmit={handleAddStaff} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ชื่อ-นามสกุล</label>
                  <input
                    type="text"
                    required
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ชื่อพนักงาน"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ชื่อผู้ใช้ (Username)</label>
                  <input
                    type="text"
                    required
                    value={newStaff.username}
                    onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="username"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">รหัสผ่าน</label>
                  <input
                    type="password"
                    required
                    value={newStaff.password}
                    onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ระดับสิทธิ์</label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as Role })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="staff">พนักงาน (Staff)</option>
                    <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                  </select>
                </div>
                <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowStaffForm(false)}
                    className="px-4 py-2 text-slate-500 hover:bg-slate-200 rounded-xl transition-colors text-sm font-bold"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-bold shadow-sm"
                  >
                    บันทึกพนักงาน
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-100">
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">พนักงาน</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">ชื่อผู้ใช้</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">สิทธิ์</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allUsers.map((u) => (
                  <tr key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-500">{u.username}</td>
                    <td className="py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                        u.role === 'admin' ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600"
                      )}>
                        <Shield className="w-3 h-3" />
                        {u.role === 'admin' ? 'Admin' : 'Staff'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {u.id !== '1' && u.id !== currentUser?.id && (
                        <button
                          onClick={() => {
                            if (window.confirm(`ยืนยันการลบพนักงาน ${u.name}?`)) {
                              deleteUser(u.id);
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          title="ลบพนักงาน"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

