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
      alert("Failed to create ticket");
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
      alert("Failed to send reply");
    } finally {
      setReplying(false);
    }
  };

  return (
    <div className="p-6 mx-auto flex flex-col gap-6 text-gray-700">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">پشتیبانی</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="cursor-pointer bg-blue-50 p-2 rounded-md hover:bg-blue-100 transition"
        >
          ایجاد تیکت
        </button>
      </div>

      {/* Create Ticket Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded-2xl p-5 relative shadow-xl border border-gray-200">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-3 right-3 text-xl font-bold text-gray-400 hover:text-red-500 transition"
            >
              &times;
            </button>
            <h2 className="text-lg font-medium mb-3 text-gray-700 text-center">
              ایجاد تیکت جدید
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="عنوان تیکت"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <textarea
                placeholder="توضیحات"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="border border-gray-300 p-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                rows={4}
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="low">کم</option>
                <option value="medium">متوسط</option>
                <option value="high">زیاد</option>
              </select>
              <button
                type="submit"
                disabled={creating}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-md hover:from-blue-600 hover:to-blue-700 transition"
              >
                {creating ? "در حال ایجاد..." : "ایجاد تیکت"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tickets Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-2xl ">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-start text-gray-600">عنوان</th>
              <th className="py-2 px-4 text-start text-gray-600">اولویت</th>
              <th className="py-2 px-4 text-start text-gray-600">وضعیت</th>
              <th className="py-2 px-4 text-start text-gray-600">ایجاد شده</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  در حال بارگذاری...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-red-500">
                  {error}
                </td>
              </tr>
            )}
            {!loading && tickets.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  تیکتی وجود ندارد
                </td>
              </tr>
            )}
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="cursor-pointer text-start hover:bg-gray-50 transition"
              >
                <td className="py-2 px-4">{ticket.title}</td>
                <td className="py-2 px-4">
                  {priorityMap[ticket.priority] || ticket.priority}
                </td>
                <td className="py-2 px-4">
                  {statusMap[ticket.status] || ticket.status}
                </td>{" "}
                <td className="py-2 px-4">
                  {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[50%]  rounded-2xl p-6 relative shadow-xl border border-gray-200 overflow-y-auto max-h-[80vh]">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-3 right-3 text-xl font-bold text-gray-400 hover:text-red-500 transition"
            >
              &times;
            </button>
            <div className="bg-gray-50 p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                {selectedTicket.title}
              </h2>
              <p className="mb-4">{selectedTicket.description}</p>
              <div className="flex gap-4 mb-4 text-sm text-gray-500">
                <span>
                  اولویت:{" "}
                  {priorityMap[selectedTicket.priority] ||
                    selectedTicket.priority}
                </span>
                <span>
                  وضعیت:{" "}
                  {statusMap[selectedTicket.status] || selectedTicket.status}
                </span>
              </div>
            </div>
            <div className="w-full h-1 bg-gray-200 my-6"></div>
            <div>
              <h3 className="font-semibold my-2 text-gray-700">پاسخ‌ ها</h3>
              {selectedTicket.replies?.length ? (
                <ul className="flex flex-col gap-2">
                  {selectedTicket.replies.map((reply: any) => (
                    <li
                      key={reply.id}
                      className="p-5 border rounded-md bg-gray-50"
                    >
                      <p className="text-gray-700">{reply.content}</p>
                      <span className="text-xs text-gray-400">
                        ارسال شده در:{" "}
                        {new Date(reply.createdAt).toLocaleDateString("fa-IR")}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">هیچ پاسخی وجود ندارد</p>
              )}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleReplySubmit} className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="نوشتن پاسخ..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                required
                className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <button
                type="submit"
                disabled={replying}
                className="bg-blue-500 text-white px-4 rounded-md hover:bg-blue-600 transition"
              >
                {replying ? "ارسال..." : "ارسال"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
