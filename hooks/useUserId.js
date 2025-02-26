import { useEffect, useState } from "react";

export default function useUserId() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("userId", id);
    }
    setUserId(id);
  }, []);

  return userId;
}
