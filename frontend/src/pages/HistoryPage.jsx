import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const HistoryPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/transactions/me");
      setTransactions(data.transactions || []);
    };
    load();
  }, []);

  return (
    <section className="container">
      <h2>Transaction History</h2>
      <article className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Counterparty</th>
                <th>Amount</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const isDebit = tx.sender?._id === user?._id;
                const counterparty = isDebit ? tx.recipient : tx.sender;
                return (
                  <tr key={tx._id}>
                    <td>{new Date(tx.createdAt).toLocaleString()}</td>
                    <td>{isDebit ? "Debit" : "Credit"}</td>
                    <td>
                      {counterparty?.name} ({counterparty?.accountNumber})
                    </td>
                    <td className={isDebit ? "text-red" : "text-green"}>
                      {isDebit ? "-" : "+"}${tx.amount.toFixed(2)}
                    </td>
                    <td>{tx.note || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};

export default HistoryPage;

