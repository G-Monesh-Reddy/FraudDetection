import React, { useState } from "react";
import "./App.css";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

function App() {
    const [amt, setAmt] = useState("");
    const [category, setCategory] = useState("");
    const [gender, setGender] = useState("");
    const [time, setTime] = useState("");
    const [unnamed, setUnnamed] = useState("");
    const [cityPop, setCityPop] = useState("");
    const [prediction, setPrediction] = useState("");
    const [error, setError] = useState("");
    const [history, setHistory] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setPrediction("");

        const data = {
            amt: parseFloat(amt),
            category: parseInt(category),
            gender: parseInt(gender),
            time: time,
            "Unnamed: 0": parseInt(unnamed),
            city_pop: parseInt(cityPop),
        };

        try {
            const response = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                setPrediction(result.prediction);
                setHistory([
                    ...history,
                    { ...data, prediction: result.prediction },
                ]);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError("Error connecting to the server.");
        }
    };

    const barData = {
        labels: history.map((item, index) => `Tx ${index + 1}`),
        datasets: [
            {
                label: "Transaction Amount",
                data: history.map((item) => item.amt),
                backgroundColor: "#4CAF50",
            },
        ],
    };

    const pieData = {
        labels: ["Legitimate", "Fraudulent"],
        datasets: [
            {
                data: [
                    history.filter((item) =>
                        item.prediction.includes("Legitimate")
                    ).length,
                    history.filter((item) =>
                        item.prediction.includes("Fraudulent")
                    ).length,
                ],
                backgroundColor: ["#2ecc71", "#e74c3c"],
            },
        ],
    };

    const lineData = {
        labels: history.map((item) => item.time),
        datasets: [
            {
                label: "Transaction Trend",
                data: history.map((item) => item.amt),
                borderColor: "#3498db",
                fill: false,
            },
        ],
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Fraud Detection Dashboard</h1>
                <p className="p">
                    1.Online Cretid Card 2.Using Credit Card Physically{" "}
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amt}
                        onChange={(e) => setAmt(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Gender (0 or 1)"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Time (YYYY-MM-DD HH:MM:SS)"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Unnamed: 0"
                        value={unnamed}
                        onChange={(e) => setUnnamed(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="City Population"
                        value={cityPop}
                        onChange={(e) => setCityPop(e.target.value)}
                        required
                    />
                    <button type="submit">Predict</button>
                </form>
                {prediction && <h2>Prediction: {prediction}</h2>}
                {error && <h2 style={{ color: "red" }}>Error: {error}</h2>}

                <div style={{ width: "80%", margin: "auto" }}>
                    <h3>Transaction Amounts</h3>
                    <Bar data={barData} />
                </div>

                <div
                    style={{ width: "50%", margin: "auto", marginTop: "20px" }}
                >
                    <h3>Fraud vs Legitimate Transactions</h3>
                    <Pie data={pieData} />
                </div>

                <div
                    style={{ width: "80%", margin: "auto", marginTop: "20px" }}
                >
                    <h3>Transaction Trends Over Time</h3>
                    <Line data={lineData} />
                </div>
            </header>
        </div>
    );
}

export default App;
