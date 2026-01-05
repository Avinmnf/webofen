"use client";

import React, { useRef } from 'react';
import { Calendar as DatePicker } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import {
  Edit2,
  Crown,
  XCircle,
  Clock,
  CheckCircle
} from "lucide-react";

interface InputField {
  id: string;
  label: string;
  placeholder?: string;
  required: boolean;
  fieldType: string;
}

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: any;
  fields: InputField[];
  values: Record<string, string>;
  handleChange: (fieldId: string, value: string) => void;
  handleSubmit: () => Promise<void>;
  canEdit: boolean;
  isVIP: boolean;
  inputLoading: boolean;
  inputError: string | null;
  deadlineLoading: boolean;
  deadlineError: string | null;
  resetError: () => void;
  openCalendarId: string | null;
  setOpenCalendarId: (id: string | null) => void;
  selectedDate: Record<string, Date | null>;
  setSelectedDate: React.Dispatch<React.SetStateAction<Record<string, Date | null>>>;
  handleUpdateVipDeadline: (itemId: string, deadlineDate: string) => Promise<void>;
}

const InputModal: React.FC<InputModalProps> = ({
  isOpen,
  onClose,
  selectedItem,
  fields,
  values,
  handleChange,
  handleSubmit,
  canEdit,
  isVIP,
  inputLoading,
  inputError,
  deadlineLoading,
  deadlineError,
  resetError,
  openCalendarId,
  setOpenCalendarId,
  selectedDate,
  setSelectedDate,
  handleUpdateVipDeadline
}) => {
  const calendarRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !selectedItem) return null;

  // Handle date change
  const handleDateChange = (date: any) => {
    if (date && selectedItem) {
      const newDate = date.toDate();
      setSelectedDate((prev: Record<string, Date | null>) => ({
        ...prev,
        [selectedItem.id]: newDate
      }));
    }
  };

  // Handle delete deadline
  const handleDeleteDeadline = () => {
    if (!deadlineLoading && selectedItem) {
      setSelectedDate((prev: Record<string, Date | null>) => ({ 
        ...prev, 
        [selectedItem.id]: null 
      }));
      handleUpdateVipDeadline(selectedItem.id, "");
      setOpenCalendarId(null);
    }
  };

  // Handle save deadline
  const handleSaveDeadline = () => {
    if (selectedItem && selectedDate[selectedItem.id] && !deadlineLoading) {
      handleUpdateVipDeadline(selectedItem.id, selectedDate[selectedItem.id]!.toISOString());
      setOpenCalendarId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    <Edit2 className="w-6 h-6 text-blue-600" />
                  </div>
                  {isVIP && (
                    <Crown className="w-5 h-5 text-amber-500 absolute -top-2 -right-2" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">ثبت اطلاعات سفارش</h3>
                  <p className="text-sm text-gray-500 mt-1">{selectedItem.productTitle}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {fields?.map((field) => (
                <div key={field.id}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && <span className="text-red-500 mr-1">*</span>}
                    </label>
                    {/* VIP Deadline Selector */}
                    {isVIP && field.label === "Site URL" && (
                      <div className="relative" ref={calendarRef}>
                        <button
                          type="button"
                          onClick={() => setOpenCalendarId(openCalendarId === selectedItem.id ? null : selectedItem.id)}
                          disabled={deadlineLoading}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg text-sm font-medium text-amber-700 hover:border-amber-300 transition disabled:opacity-50"
                        >
                          <Clock className="w-4 h-4" />
                          {selectedItem.vipDeadline
                            ? `مهلت: ${new Date(selectedItem.vipDeadline).toLocaleDateString("fa-IR")}`
                            : "تعیین مهلت ویژه"}
                        </button>

                        {openCalendarId === selectedItem.id && (
                          <div className="absolute top-full left-0 mt-2 z-50 bg-white border shadow-xl rounded-xl p-4">
                            <DatePicker
                              calendar={persian}
                              locale={persian_fa}
                              value={
                                selectedDate[selectedItem.id] ||
                                (selectedItem.vipDeadline
                                  ? new Date(selectedItem.vipDeadline)
                                  : null)
                              }
                              onChange={handleDateChange}
                              plugins={[<TimePicker position="bottom" />]}
                            />
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={handleSaveDeadline}
                                className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50"
                                disabled={!selectedDate[selectedItem.id] || deadlineLoading}
                              >
                                {deadlineLoading ? "..." : "تایید"}
                              </button>
                              <button
                                onClick={handleDeleteDeadline}
                                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50"
                                disabled={deadlineLoading}
                              >
                                حذف
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <input
                    type={field.fieldType === "number" ? "number" : "text"}
                    name={field.id}
                    placeholder={field.placeholder || field.label}
                    value={values[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none transition disabled:bg-gray-50 disabled:cursor-not-allowed"
                    required={field.required}
                    disabled={!canEdit}
                  />
                </div>
              ))}

              {!canEdit ? (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-medium text-gray-900">این سفارش قبلاً ثبت شده است</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    اطلاعات این سفارش قبلاً ثبت شده و دیگر قابل تغییر نیست. برای مشاهده جزئیات می‌توانید به صفحه تاریخچه مراجعه کنید.
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                  <h4 className="font-medium text-gray-900 mb-3">توجه مهم</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>اطلاعات وارد شده پس از تایید، قابل ویرایش نیستند.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>از صحت اطلاعات قبل از ارسال مطمئن شوید.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>پس از ثبت، وضعیت سفارش برای بررسی ارسال می‌شود.</span>
                    </li>
                  </ul>
                </div>
              )}

              {deadlineError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-red-700">{deadlineError}</p>
                    <button
                      onClick={resetError}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {inputError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-700">{inputError}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!canEdit || inputLoading}
                className={`w-full py-4 rounded-xl font-semibold transition ${canEdit
                  ? "bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white shadow-lg"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {inputLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>در حال ثبت اطلاعات...</span>
                  </div>
                ) : !canEdit ? (
                  "ثبت شده"
                ) : (
                  "ثبت اطلاعات سفارش"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputModal;