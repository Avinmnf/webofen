import type { NextApiRequest, NextApiResponse } from "next";

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3000/api/graphql";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Extract user info from headers (sent from frontend via useAuth)
  const userId = req.headers['x-user-id'] as string;
  const role = req.headers['x-user-role'] as string;

  if (!userId || !role) {
    return res.status(401).json({ error: "کاربر احراز هویت نشده است" });
  }

  if (req.method === "GET") {
    const query = `
      query GetUser($id: ID!) {
        user(where: { id: $id }) {
          id
          name
          email
          gender
          phone
          address
          birthDate
          imageUrl
          role { id name }
          createdAt
        }
      }
    `;

    try {
      const response = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { id: userId } }),
      });
      const result = await response.json();

      if (!result.data.user) {
        return res.status(404).json({ error: "کاربر یافت نشد" });
      }

      return res.status(200).json(result.data.user);
    } catch (err: any) {
      return res.status(500).json({ error: "خطا در دریافت اطلاعات کاربر", details: err.message });
    }
  }

  if (req.method === "PUT") {
    if (!["client", "vipclient"].includes(role)) {
      return res.status(403).json({ error: "شما اجازه ویرایش اطلاعات را ندارید" });
    }

    const { name, email, gender, address, birthDate, imageUrl } = req.body;

    const mutation = `
      mutation UpdateUser($id: ID!, $data: UserUpdateInput!) {
        updateUser(where: { id: $id }, data: $data) {
          id
          name
          email
          phone
          gender
          address
          birthDate
          imageUrl
        }
      }
    `;

    const variables: any = {
      id: userId,
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(gender && { gender }),
        ...(address && { address }),
        ...(birthDate && { birthDate }),
        ...(imageUrl && { imageUrl }),
      },
    };

    try {
      const response = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation, variables }),
      });

      const result = await response.json();
      return res.status(200).json({ success: true, user: result.data.updateUser });
    } catch (err: any) {
      return res.status(500).json({ error: "خطا در بروزرسانی اطلاعات", details: err.message });
    }
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
