import { useEffect, useState } from "react";
import api from "../api/api";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadAdminData = async () => {
    try {
      const [usersRes, txRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/transactions")
      ]);
      setUsers(usersRes.data.users || []);
      setTransactions(txRes.data.transactions || []);
    } catch (err) {
      setError("Unable to load admin data");
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const toggleBlock = async (id) => {
    try {
      const { data } = await api.patch(`/admin/users/${id}/toggle-block`);
      setMessage(data.message);
      await loadAdminData();
    } catch (err) {
      setError(err?.response?.data?.message || "Action failed");
    }
  };

  return (
    <section className="container">
      <h2>Admin Dashboard</h2>
      {message && <p className="alert success">{message}</p>}
      {error && <p className="alert error">{error}</p>}

      <article className="card">
        <h3>Manage Users</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Account</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.accountNumber}</td>
                  <td>${u.balance.toFixed(2)}</td>
                  <td>{u.isBlocked ? "Blocked" : "Active"}</td>
                  <td>
                    {u.role === "admin" ? (
                      "Admin"
                    ) : (
                      <button className="btn-outline" onClick={() => toggleBlock(u._id)}>
                        {u.isBlocked ? "Unblock" : "Block"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="card">
        <h3>All Transactions</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Sender</th>
                <th>Recipient</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td>{new Date(tx.createdAt).toLocaleString()}</td>
                  <td>{tx.sender?.accountNumber}</td>
                  <td>{tx.recipient?.accountNumber}</td>
                  <td>${tx.amount.toFixed(2)}</td>
                  <td>{tx.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};

export default AdminPage;

