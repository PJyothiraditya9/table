import React, { useEffect, useMemo, useState } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const [apiPage, setApiPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortDir, setSortDir] = useState("asc");
  const [filterDomain, setFilterDomain] = useState("");
  const [filterFirstLetter, setFilterFirstLetter] = useState("");

  const [pageSize, setPageSize] = useState(6);
  const [page, setPage] = useState(1);

  async function fetchPage(p) {
  setLoading(true);
  setError("");
  try {
    const res = await fetch(
      `https://reqres.in/api/users?page=${p}&per_page=${pageSize}`,
      {
        headers: {
          Accept: "application/json",
          "x-api-key": "reqres-free-v1",
          Authorization: "Bearer reqres-free-v1",
        },
      }
    );

    const text = await res.text();
    console.log("Raw response:", text);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = JSON.parse(text);

    setUsers((prev) => {
      const map = new Map(prev.map((u) => [u.id, u]));
      for (const u of data.data) map.set(u.id, u);
      return Array.from(map.values());
    });

    setTotalPages(data.total_pages || 1);
  } catch (err) {
    console.error(err);
    setError(err.message || "Failed to fetch");
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    fetchPage(1);
  }, []);

  const loadMoreApi = async () => {
    if (apiPage >= totalPages) return;

    const next = apiPage + 1;
    await fetchPage(next);
    setApiPage(next);

    setPageSize((prev) => {
      const newTotal = (next) * 6; 
      return Math.max(prev, newTotal);
    });
  };

  const processed = useMemo(() => {
    let list = [...users];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((u) => {
        const full = `${u.first_name} ${u.last_name}`.toLowerCase();
        return full.includes(q) || (u.email && u.email.toLowerCase().includes(q));
      });
    }

    if (filterDomain.trim()) {
      const d = filterDomain.trim().toLowerCase();
      list = list.filter((u) => u.email && u.email.toLowerCase().endsWith(d));
    }

    if (filterFirstLetter.trim()) {
      const c = filterFirstLetter.trim().toLowerCase();
      list = list.filter((u) => u.first_name && u.first_name.toLowerCase().startsWith(c));
    }

    if (sortKey) {
      list.sort((a, b) => {
        const A = (a[sortKey] || "").toString().toLowerCase();
        const B = (b[sortKey] || "").toString().toLowerCase();
        if (A < B) return sortDir === "asc" ? -1 : 1;
        if (A > B) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [users, query, sortKey, sortDir, filterDomain, filterFirstLetter]);

  const pageCount = Math.max(1, Math.ceil(processed.length / pageSize));
  const visible = processed.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [pageCount]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="w-full max-w-full mx-auto bg-white rounded-2xl shadow p-4 md:p-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">User Directory</h1>
        </header>

        <section className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email"
            className="p-2 border rounded bg-white text-gray-800 placeholder-gray-500"
          />

          <div className="flex gap-2">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="p-2 border rounded bg-white text-gray-800 placeholder-gray-500 flex-1"
            >
              <option value="">Sort by</option>
              <option value="first_name">First name</option>
              <option value="email">Email</option>
            </select>

            <button
              onClick={() => setSortDir((s) => (s === "asc" ? "desc" : "asc"))}
              className="p-2 border rounded"
              title="Toggle sort direction"
            >
              {sortDir === "asc" ? "↑" : "↓"}
            </button>
          </div>

          <div className="flex gap-2">
            <input
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              placeholder="Filter by email domain (e.g. @reqres.in)"
              className="p-2 border rounded bg-white text-gray-800 placeholder-gray-500 flex-1"
            />

            <input
              value={filterFirstLetter}
              onChange={(e) => setFilterFirstLetter(e.target.value)}
              placeholder="First letter"
              maxLength={1}
              className="w-28 p-2 border rounded text-center bg-gray-100 text-gray-800"
            />

          </div>
        </section>


        <section className="mt-6">
          <div className="overflow-x-auto rounded border border-black">
            <table className="min-w-full divide-y" role="table">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2 text-left text-sm font-medium text-gray-700">ID</th>
                  <th className="p-2 text-left text-sm font-medium text-gray-700">Avatar</th>
                  <th className="p-2 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="p-2 text-left text-sm font-medium text-gray-700">Email</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y">
                {visible.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="p-2 text-sm text-gray-800 align-middle">{u.id}</td>

                    <td className="p-2 align-middle">
                      <img src={u.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
                    </td>

                    <td className="p-2 text-sm text-gray-800 align-middle break-words">
                      {u.first_name ?? ""} {u.last_name ?? ""}
                    </td>

                    <td className="p-2 text-sm text-gray-800 align-middle break-words">
                      {u.email ?? ""}
                    </td>
                  </tr>
                ))}

                {visible.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm">Rows:</label>
              <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-900 shadow-sm">
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={12}>12</option>
              </select>

              <button onClick={loadMoreApi} disabled={apiPage >= totalPages || loading} className="ml-4 p-2 border rounded disabled:opacity-50">
                Load more API pages
              </button>

              {loading && (
                <div className="ml-3">Loading...</div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="p-2 border rounded">Prev</button>
              <div className="p-2">Page {page} / {pageCount}</div>
              <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} className="p-2 border rounded">Next</button>
            </div>
          </div>

          {error && <div className="mt-4 text-red-500">Error: {error}</div>}
        </section>

        <footer className="mt-6 text-sm text-gray-500">Tip: click "Load more API pages" to fetch additional pages from the demo API. Currently loaded: {users.length} users.</footer>
      </div>
    </div>
  );
}
