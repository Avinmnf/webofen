"use client";

import { useState, useEffect, useCallback } from "react";

export type InputField = {
  id: string;
  label: string;
  fieldType: "text" | "textarea" | "number" | "url";
  placeholder?: string;
  required: boolean; // changed to boolean for easier checks
  value?: string; // current saved value
  inputValueId?: string; // id of the existing OrderItemInputValue
};

export type InputValuePayload = {
  inputValueId: string | null; // null for new fields
  fieldId?: string; // required for creating new field
  value: string;
};

export function useOrderInput(orderItemId: string | null) {
  const [fields, setFields] = useState<InputField[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFields = useCallback(async () => {
    if (!orderItemId) {
      setFields([]);
      setValues({});
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/proxy/orderinput?orderItemId=${orderItemId}`
      );
      if (!res.ok) throw new Error(`Failed to fetch fields (${res.status})`);

      const data = await res.json();
      const fetchedFields: InputField[] = Array.isArray(data.inputFields)
        ? data.inputFields
        : [];

      // Defensive: ensure each field has required properties
      const safeFields = fetchedFields.map((f) => ({
        id: f.id,
        label: f.label || "",
        fieldType: f.fieldType || "text",
        placeholder: f.placeholder || "",
        required: !!f.required,
        value: f.value || "",
        inputValueId: f.inputValueId || undefined, // <- use undefined instead of null
      }));

      setFields(safeFields);

      // Initialize values
      const initValues: Record<string, string> = {};
      safeFields.forEach((f) => {
        initValues[f.id] = f.value || "";
      });
      setValues(initValues);
    } catch (err: any) {
      console.error("❌ Error fetching input fields:", err);
      setFields([]); // fallback
      setValues({});
      setError(err.message || "Failed to fetch input fields");
    } finally {
      setLoading(false);
    }
  }, [orderItemId]);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const handleChange = useCallback((fieldId: string, val: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: val }));
  }, []);

  const submitValues = useCallback(async () => {
    if (!orderItemId) throw new Error("Missing orderItemId");
    if (!fields.length) return { success: true }; // nothing to submit

    setLoading(true);
    setError(null);

    try {
      const payload: InputValuePayload[] = fields.map((f) => ({
        inputValueId: f.inputValueId || null,
        fieldId: !f.inputValueId ? f.id : undefined,
        value: values[f.id] || "",
      }));

      const res = await fetch(`/api/proxy/orderinput`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderItemId, inputValues: payload }),
      });

      if (!res.ok)
        throw new Error(`Failed to submit input values (${res.status})`);
      return await res.json();
    } catch (err: any) {
      console.error("❌ Error submitting input values:", err);
      setError(err.message || "Failed to submit input values");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [orderItemId, fields, values]);

  // ⬇ New function to fetch saved values manually
  const fetchValues = async (id: string) => {
    try {
      const res = await fetch(`/api/order-values/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };
  return { fields, values, setValues, handleChange, submitValues, fetchValues, loading, error };

}
