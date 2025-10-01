import { useState } from "react";

export type FormField = {
  label: string;
  type: "text" | "textarea" | "number";
  content: string;
};

export type FormPayload = {
  title: string;
  fields: FormField[];
};

export function useForms() {
  const [loading, setLoading] = useState(false);

  const submitForm = async (payload: FormPayload) => {
    setLoading(true);
    try {
      // همه فیلدها حتی اگر خالی باشند
      const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_API}/form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: payload.title,
          fields: payload.fields,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        console.error("Server returned error:", data.error);
        throw new Error(data.error || "خطا در ارسال فرم");
      }

      return data;
    } catch (err: any) {
      console.error("Form submission error:", err.message || err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submitForm, loading };
}
