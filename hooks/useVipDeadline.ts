import { useState } from 'react';

interface UpdateDeadlineResponse {
  success: boolean;
  message: string;
  orderItem: {
    id: string;
    vipDeadline: string;
    deadline: string;
    adminStatus: string;
    startTime: string;
    order: {
      id: string;
      user: {
        id: string;
        role: {
          id: string;
          name: string;
        };
      };
    };
    variant: {
      product: {
        title: string;
        slug: string;
      };
      attributeValues: Array<{
        attribute: {
          name: string;
        };
        value: string;
      }>;
    };
  };
}

interface UseVipDeadlineReturn {
  updateVipDeadline: (itemId: string, deadlineDate: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  resetError: () => void;
}

export const useVipDeadline = (): UseVipDeadlineReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateVipDeadlineInDB = async (itemId: string, deadlineDate: string): Promise<UpdateDeadlineResponse> => {
    const response = await fetch('/api/proxy/vipdeadline', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        orderItemId: itemId, 
        deadlineDate: deadlineDate 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update VIP deadline');
    }

    return await response.json();
  };

  const updateVipDeadline = async (itemId: string, deadlineDate: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateVipDeadlineInDB(itemId, deadlineDate);
      console.log("VIP deadline updated successfully:", result.message);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "خطا در به‌روزرسانی مهلت VIP";
      setError(errorMessage);
      console.error("Failed to update VIP deadline:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => setError(null);

  return {
    updateVipDeadline,
    loading,
    error,
    resetError
  };
};