'use client';

import { useState, useEffect, useCallback } from 'react';

export type InputField = {
  id: string;
  label: string;
  fieldType: 'text' | 'textarea' | 'number' | 'url';
  placeholder?: string;
  required: string;
};

export type InputValuePayload = {
  productInputFieldId: string;
  value: string;
};

export function useOrderInput(orderItemId: string | null) {
  const [fields, setFields] = useState<InputField[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // fetch fields
  const fetchFields = useCallback(async () => {
    if (!orderItemId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/proxy/orderinput?orderItemId=${orderItemId}`);
      if (!res.ok) throw new Error(`Failed to fetch fields (${res.status})`);
      const data = await res.json();
      setFields(data.inputFields || []);

      // Initialize values for each field
      const init: Record<string, string> = {};
      (data.inputFields || []).forEach((f: InputField) => (init[f.id] = ''));
      setValues(init);
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

  // handle input change
  const handleChange = useCallback((fieldId: string, val: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: val }));
  }, []);

  // submit values
  const submitValues = useCallback(async () => {
    if (!orderItemId) throw new Error('Missing orderItemId');
    setLoading(true);
    setError(null);
    try {
      const payload: InputValuePayload[] = Object.keys(values).map((fieldId) => ({
        productInputFieldId: fieldId,
        value: values[fieldId],
      }));

      const res = await fetch('/api/proxy/orderinput', {
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
  }, [orderItemId, values]);

  return { fields, values, loading, error, fetchFields, handleChange, submitValues };
}
