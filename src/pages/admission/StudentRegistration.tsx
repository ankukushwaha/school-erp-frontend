import React, { useState } from 'react';
import {
  Users,
  User,
  Shield,
  AlertCircle,
  Heart,
  Briefcase,
  Save,
  Send,
  CheckCircle,
  Phone,
  Mail,
  Camera,
  X,
  UserPlus
} from 'lucide-react';

interface RegistrationFormData {
  // Basic Student Info (from enquiry)
  studentName: string;
  dateOfBirth: string;
  gender: string;
  classApplying: string;

  // Additional Student Details
  bloodGroup: string;
  nationality: string;
  religion: string;
  caste: string;
  category: string;
  motherTongue: string;
  aadharNumber: string;
  identificationMarks: string;

  // Guardian Information
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianRelation: string;
  guardianOccupation: string;

  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  emergencyContactAddress: string;

  // Medical Information
  allergies: string;
  medicalConditions: string;
  currentMedication: string;
  doctorName: string;
  doctorPhone: string;
  bloodDonorName: string;
  bloodDonorPhone: string;

  // Financial Information
  annualIncome: string;

  // Sibling Information
  hasSibling: boolean;
  siblingName: string;
  siblingClass: string;
  siblingAdmissionNumber: string;
}

export const StudentRegistrationFormPage = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    studentName: '',
    dateOfBirth: '',
    gender: '',
    classApplying: '',
    bloodGroup: '',
    nationality: 'Indian',
    religion: '',
    caste: '',
    category: '',
    motherTongue: '',
    aadharNumber: '',
    identificationMarks: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianRelation: '',
    guardianOccupation: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    emergencyContactAddress: '',
    allergies: '',
    medicalConditions: '',
    currentMedication: '',
    doctorName: '',
    doctorPhone: '',
    bloodDonorName: '',
    bloodDonorPhone: '',
    annualIncome: '',
    hasSibling: false,
    siblingName: '',
    siblingClass: '',
    siblingAdmissionNumber: ''
  });

  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState('');

  const generateRegistrationNumber = () => {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `REG${year}${month}${random}`;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const regNum = generateRegistrationNumber();
    setRegistrationNumber(regNum);
    setShowSuccessModal(true);
    console.log('Registration Submitted:', { ...formData, registrationNumber: regNum });
  };

  const handleSaveDraft = () => {
    localStorage.setItem('registration_draft', JSON.stringify(formData));
    alert('Draft saved successfully!');
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      dateOfBirth: '',
      gender: '',
      classApplying: '',
      bloodGroup: '',
      nationality: 'Indian',
      religion: '',
      caste: '',
      category: '',
      motherTongue: '',
      aadharNumber: '',
      identificationMarks: '',
      guardianName: '',
      guardianPhone: '',
      guardianEmail: '',
      guardianRelation: '',
      guardianOccupation: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: '',
      emergencyContactAddress: '',
      allergies: '',
      medicalConditions: '',
      currentMedication: '',
      doctorName: '',
      doctorPhone: '',
      bloodDonorName: '',
      bloodDonorPhone: '',
      annualIncome: '',
      hasSibling: false,
      siblingName: '',
      siblingClass: '',
      siblingAdmissionNumber: ''
    });
    setPhotoPreview('');
    setShowSuccessModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <UserPlus className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Student Registration Form</h1>
            <p className="text-purple-100 mt-2">Complete student profile with detailed information</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Photo Upload */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Student Photograph</h2>
              <p className="text-sm text-gray-600">Upload a recent passport-size photo</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="w-40 h-48 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img src={photoPreview} alt="Student" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-12 h-12 text-gray-400" />
                )}
              </div>
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => setPhotoPreview('')}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex-1">
              <label className="block w-full px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-center font-semibold cursor-pointer hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg">
                <Camera className="w-5 h-5 inline-block mr-2" />
                Upload Student Photo
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </label>
              <p className="text-xs text-gray-600 mt-2">
                Upload a recent passport-size photograph (JPG, PNG - Max 2MB)
              </p>
            </div>
          </div>
        </div>

        {/* Basic Student Information */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Basic Student Information</h2>
              <p className="text-sm text-gray-600">Student's personal details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Student Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Class Applying For <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.classApplying}
                onChange={(e) => setFormData({ ...formData, classApplying: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              >
                <option value="">Select Class</option>
                <option value="Nursery">Nursery</option>
                <option value="LKG">LKG</option>
                <option value="UKG">UKG</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                  <option key={i} value={`Class ${i}`}>Class {i}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Additional Student Details */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Additional Student Details</h2>
              <p className="text-sm text-gray-600">Complete profile information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Blood Group <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nationality <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Religion
              </label>
              <input
                type="text"
                value={formData.religion}
                onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Caste
              </label>
              <input
                type="text"
                value={formData.caste}
                onChange={(e) => setFormData({ ...formData, caste: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              >
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="OBC">OBC (Other Backward Class)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mother Tongue
              </label>
              <input
                type="text"
                value={formData.motherTongue}
                onChange={(e) => setFormData({ ...formData, motherTongue: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Aadhar Number
              </label>
              <input
                type="text"
                value={formData.aadharNumber}
                onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="XXXX XXXX XXXX"
                maxLength={14}
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Identification Marks
              </label>
              <input
                type="text"
                value={formData.identificationMarks}
                onChange={(e) => setFormData({ ...formData, identificationMarks: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="e.g., Mole on left cheek, Scar on right hand"
              />
            </div>
          </div>
        </div>

        {/* Guardian Information */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Guardian Information</h2>
              <p className="text-sm text-gray-600">If different from parents</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Guardian Name
              </label>
              <input
                type="text"
                value={formData.guardianName}
                onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Guardian Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Guardian Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.guardianEmail}
                  onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Relation with Student
              </label>
              <input
                type="text"
                value={formData.guardianRelation}
                onChange={(e) => setFormData({ ...formData, guardianRelation: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="e.g., Grandfather, Uncle, Aunt"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Guardian Occupation
              </label>
              <input
                type="text"
                value={formData.guardianOccupation}
                onChange={(e) => setFormData({ ...formData, guardianOccupation: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Emergency Contact Information</h2>
              <p className="text-sm text-gray-600">Primary emergency contact details <span className="text-red-500">*</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Person Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Relation with Student <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.emergencyContactRelation}
                onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Emergency Contact Address
              </label>
              <input
                type="text"
                value={formData.emergencyContactAddress}
                onChange={(e) => setFormData({ ...formData, emergencyContactAddress: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Medical & Health Information</h2>
              <p className="text-sm text-gray-600">Student's health details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Known Allergies
              </label>
              <textarea
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                rows={3}
                placeholder="List any allergies (food, medicine, environmental)..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Medical Conditions
              </label>
              <textarea
                value={formData.medicalConditions}
                onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                rows={3}
                placeholder="List any chronic conditions, disabilities, or health concerns..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Medication (if any)
              </label>
              <textarea
                value={formData.currentMedication}
                onChange={(e) => setFormData({ ...formData, currentMedication: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                rows={2}
                placeholder="List current medications with dosage and frequency..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Family Doctor Name
              </label>
              <input
                type="text"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Doctor's Contact Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.doctorPhone}
                  onChange={(e) => setFormData({ ...formData, doctorPhone: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Blood Donor Name
              </label>
              <input
                type="text"
                value={formData.bloodDonorName}
                onChange={(e) => setFormData({ ...formData, bloodDonorName: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Blood Donor Contact
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.bloodDonorPhone}
                  onChange={(e) => setFormData({ ...formData, bloodDonorPhone: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Financial Information</h2>
              <p className="text-sm text-gray-600">Family income details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Annual Family Income <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.annualIncome}
                onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              >
                <option value="">Select Income Range</option>
                <option value="Below 1 Lakh">Below ₹1 Lakh</option>
                <option value="1-2 Lakhs">₹1-2 Lakhs</option>
                <option value="2-5 Lakhs">₹2-5 Lakhs</option>
                <option value="5-10 Lakhs">₹5-10 Lakhs</option>
                <option value="10-20 Lakhs">₹10-20 Lakhs</option>
                <option value="20-50 Lakhs">₹20-50 Lakhs</option>
                <option value="Above 50 Lakhs">Above ₹50 Lakhs</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sibling Information */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Sibling Information</h2>
              <p className="text-sm text-gray-600">If sibling studies in this school</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-3 cursor-pointer bg-white p-4 rounded-xl border-2 border-gray-300 hover:border-indigo-500 transition-all">
              <input
                type="checkbox"
                checked={formData.hasSibling}
                onChange={(e) => setFormData({ ...formData, hasSibling: e.target.checked })}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-sm font-semibold text-gray-700">Student has a sibling studying in this school</span>
            </label>
          </div>

          {formData.hasSibling && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sibling Name
                </label>
                <input
                  type="text"
                  value={formData.siblingName}
                  onChange={(e) => setFormData({ ...formData, siblingName: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sibling Class/Section
                </label>
                <input
                  type="text"
                  value={formData.siblingClass}
                  onChange={(e) => setFormData({ ...formData, siblingClass: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sibling Admission Number
                </label>
                <input
                  type="text"
                  value={formData.siblingAdmissionNumber}
                  onChange={(e) => setFormData({ ...formData, siblingAdmissionNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center sticky bottom-0 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-gray-200 shadow-2xl">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-3 shadow-md"
          >
            <Save className="w-5 h-5" />
            Save Draft
          </button>

          <button
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-3 shadow-xl shadow-purple-600/40"
          >
            <Send className="w-5 h-5" />
            Submit Registration
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform animate-bounce-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Registration Successful!</h2>
              <p className="text-gray-600 mb-6">
                Student registration has been successfully completed. You can now proceed with the admission process.
              </p>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 mb-6 border-2 border-purple-200">
                <p className="text-sm text-gray-600 mb-2">Registration Number</p>
                <p className="text-2xl font-bold text-purple-700">{registrationNumber}</p>
              </div>
              <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="font-semibold text-blue-800 mb-1">📝 Next Steps:</p>
                <ul className="text-left space-y-1 text-blue-900">
                  <li>• Proceed to complete the admission form</li>
                  <li>• Upload required documents</li>
                  <li>• Submit fee payment details</li>
                  <li>• Receive admission confirmation</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all"
                >
                  Print
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  New Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
