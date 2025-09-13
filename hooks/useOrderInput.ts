'use client';

import { useState, useEffect, useCallback } from 'react';

export type InputField = {
  id: string;
  label: string;
  fieldType: 'text' | 'textarea' | 'number' | 'url';
  placeholder?: string;
  required: string;
  value?: string;           // current saved value
  inputValueId?: string;    // id of the existing OrderItemInputValue
};

export type InputValuePayload = {
  inputValueId: string | null; // null for new fields
  fieldId?: string;            // required for creating new field
  value: string;
};

export function useOrderInput(orderItemId: string | null) {
  const [fields, setFields] = useState<InputField[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFields = useCallback(async () => {
    if (!orderItemId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/proxy/orderinput?orderItemId=${orderItemId}`);
      if (!res.ok) throw new Error(`Failed to fetch fields (${res.status})`);

      const data = await res.json();
      const fetchedFields: InputField[] = data.inputFields || [];
      setFields(fetchedFields);

      const initValues: Record<string, string> = {};
      fetchedFields.forEach((f) => {
        initValues[f.id] = f.value || '';
      });
      setValues(initValues);
    } catch (err: any) {
      console.error('❌ Error fetching input fields:', err);
      setError(err.message || 'Failed to fetch input fields');
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
    if (!orderItemId) throw new Error('Missing orderItemId');
    setLoading(true);
    setError(null);

    try {
      const payload: InputValuePayload[] = fields.map((f) => ({
        inputValueId: f.inputValueId || null,
        fieldId: !f.inputValueId ? f.id : undefined, // only needed for new input values
        value: values[f.id] || '',
      }));

      const res = await fetch(`/api/proxy/orderinput`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderItemId, inputValues: payload }),
      });

      if (!res.ok) throw new Error(`Failed to submit input values (${res.status})`);
      return await res.json();
    } catch (err: any) {
      console.error('❌ Error submitting input values:', err);
      setError(err.message || 'Failed to submit input values');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [orderItemId, fields, values]);

  return { fields, values, loading, error, fetchFields, handleChange, submitValues };
}
