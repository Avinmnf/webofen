"use client";

import { useState } from "react";
import { useTickets, Ticket } from "@/hooks/useTickets";

const TicketsPage = () => {
  const statusMap: Record<string, string> = {
    open: "باز",
    in_progress: "در حال بررسی",
    closed: "بسته",
    pending: "در انتظار",
    resolved: "حل شده",
  };

  const priorityMap: Record<string, string> = {
    low: "کم",
    medium: "متوسط",
    high: "زیاد",
  };

  const { tickets, loading, error, createTicket, createReply } = useTickets();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [creating, setCreating] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replying, setReplying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createTicket({ title, description, priority });
      setTitle("");
      setDescription("");
      setPriority("medium");
      setIsCreateModalOpen(false);
    } catch (err) {
      alert("ایجاد تیکت با خطا مواجه شد");
    } finally {
      setCreating(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    setReplying(true);
    try {
      await createReply(selectedTicket.id, replyContent);
      setReplyContent("");
    } catch (err) {
      alert("ارسال پاسخ با خطا مواجه شد");
    } finally {
      setReplying(false);
    }
  };


  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-50 text-black";
      case "in_progress":
        return "bg-purple-100 text-purple-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "resolved":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 mx-auto max-w-6xl flex flex-col gap-6 text-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">پشتیبانی</h1>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#1d546b] text-white text-sm px-4 py-2 rounded-md flex items-center gap-2  cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          ایجاد تیکت
        </button>
      </div>

      {/* Stats Cards */}

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">تیکت‌های شما</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عنوان</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اولویت</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ ایجاد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan={4} className="text-center py-8">
                    <div className="flex justify-center">
                      <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <p className="mt-2 text-gray-500">در حال بارگذاری تیکت‌ها...</p>
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={4} className="text-center py-8">
                    <div className="flex justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="mt-2 text-red-500">{error}</p>
                  </td>
                </tr>
              )}
              {!loading && tickets.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2 text-gray-500">تیکتی وجود ندارد</p>
                  </td>
                </tr>
              )}
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{ticket.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{ticket.description.substring(0, 60)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium `}>
                      {priorityMap[ticket.priority] || ticket.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(ticket.status)}`}>
                      {statusMap[ticket.status] || ticket.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-xl border border-gray-200 animate-scaleIn">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center mb-5 gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">ایجاد تیکت جدید</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">عنوان تیکت</label>
                <input
                  id="title"
                  type="text"
                  placeholder="عنوان تیکت را وارد کنید"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
                <textarea
                  id="description"
                  placeholder="توضیحات تیکت را وارد کنید"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full border border-gray-300 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">اولویت</label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="low">کم</option>
                  <option value="medium">متوسط</option>
                  <option value="high">زیاد</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={creating}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {creating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    در حال ایجاد...
                  </>
                ) : (
                  <>
                    ایجاد تیکت
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-2xl p-10 relative shadow-xl border border-gray-200 overflow-y-auto max-h-[90vh] animate-scaleIn">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedTicket.title}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                    {priorityMap[selectedTicket.priority] || selectedTicket.priority}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedTicket.status)}`}>
                    {statusMap[selectedTicket.status] || selectedTicket.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(selectedTicket.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">توضیحات تیکت</h3>
              <p className="text-gray-700">{selectedTicket.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                پاسخ‌ها
              </h3>

              {selectedTicket.replies?.length ? (
                <div className="space-y-4">
                  {selectedTicket.replies.map((reply: any) => (
                    <div key={reply.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <p className="text-gray-700">{reply.content}</p>
                      <div className="text-xs text-gray-400 mt-2">
                        ارسال شده در: {new Date(reply.createdAt).toLocaleDateString("fa-IR")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <p className="mt-2 text-gray-500">هیچ پاسخی وجود ندارد</p>
                </div>
              )}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleReplySubmit} className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">ارسال پاسخ جدید</h4>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="پاسخ خود را بنویسید..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  required
                  className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="submit"
                  disabled={replying}
                  className="bg-blue-600 text-white px-5 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {replying ? "در حال ارسال..." : "ارسال"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

     
    </div>
  );
};

export default TicketsPage;
