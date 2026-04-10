import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const COLORS = ["#0ea5e9", "#2563eb"];

const DashboardPage = () => {
  const { user, refreshProfile } = useAuth();
  const [transactions, setTransactions] = useState([]);

  const loadData = async () => {
    await refreshProfile();
    const { data } = await api.get("/transactions/me");
    setTransactions(data.transactions || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const summary = useMemo(() => {
    let sent = 0;
    let received = 0;

    transactions.forEach((tx) => {
      if (tx.sender?._id === user?._id) sent += tx.amount;
      if (tx.recipient?._id === user?._id) received += tx.amount;
    });

    return { sent, received };
  }, [transactions, user]);

  const chartData = [
    { name: "Sent", value: summary.sent || 1 },
    { name: "Received", value: summary.received || 1 }
  ];

  const monthly = transactions.slice(0, 6).map((tx) => ({
    name: new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short" }),
    amount: tx.amount
  }));

  return (
    <section className="container">
      <h2>Welcome, {user?.name}</h2>
      <div className="cards-grid">
        <article className="card stat-card">
          <h4>Account Balance</h4>
          <p className="amount">${(user?.balance || 0).toFixed(2)}</p>
          <small>Account No: {user?.accountNumber}</small>
        </article>
        <article className="card stat-card">
          <h4>Total Sent</h4>
          <p className="amount">${summary.sent.toFixed(2)}</p>
        </article>
        <article className="card stat-card">
          <h4>Total Received</h4>
          <p className="amount">${summary.received.toFixed(2)}</p>
        </article>
      </div>

      <div className="cards-grid chart-grid">
        <article className="card chart-card">
          <h3>Transaction Split</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </article>

        <article className="card chart-card">
          <h3>Recent Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthly}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>
      </div>

      <article className="card">
        <div className="row-between">
          <h3>Recent Transactions</h3>
          <Link className="btn-link" to="/history">
            View all
          </Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((tx) => (
                <tr key={tx._id}>
                  <td>{new Date(tx.createdAt).toLocaleString()}</td>
                  <td>{tx.sender?.accountNumber}</td>
                  <td>{tx.recipient?.accountNumber}</td>
                  <td>${tx.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};

export default DashboardPage;

