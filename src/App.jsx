import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [formData, setFormData] = useState({
        year: "",
        month: "",
        day: "",
        model: "",
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formattedDate = `${formData.year}-${formData.month.padStart(2, "0")}-${formData.day.padStart(2, "0")}`;

        if (!formData.model) {
            setError("Please select a model.");
            setLoading(false);
            return;
        }

        const requestData = {
            model: formData.model,
            date: formattedDate,
        };

        try {
            const response = await axios.post("https://air-quality-pred-backend.vercel.app/get_prediction", requestData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setResult(response.data);
        } catch (error) {
            setError("Error predicting air quality. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            year: "",
            month: "",
            day: "",
            model: "",
        });
        setResult(null);
        setError(null);
    };

    return (
        <div className="App">
            <div className="layout">
                <div className="description">
                    <h2>About This Project</h2>
                    <p>
                        Our Urban Air Quality Predictor is a project based on deep learning
                        (AI) models and architectures: CNN, RNN, GRU, LSTM, ResNet, ReXNet, and Attention mechanism. This program 
                        predicts the quality of the air based on 3 parameters:
                        year, month, and day. The models were trained using existing pollutant and weather data
                        from South Tangerang. Its overall average accuracy is 97.745% on training data.
                        With this project, users are able to predict the AQI and assume its overall state based on its pollutant factors.
                    </p>
                </div>

                <div className="container">
                    <h1>Air Quality Predictor 🌏</h1>
                    <form className="form" onSubmit={handleSubmit}>
                        <input
                            name="year"
                            type="number"
                            placeholder="Year"
                            value={formData.year}
                            onChange={handleChange}
                            required
                            className="input"
                            min="2023"
                            max="2026"
                        />
                        <input
                            name="month"
                            type="number"
                            placeholder="Month"
                            value={formData.month}
                            onChange={handleChange}
                            required
                            className="input"
                            min="1"
                            max="12"
                        />
                        <input
                            name="day"
                            type="number"
                            placeholder="Day"
                            value={formData.day}
                            onChange={handleChange}
                            required
                            className="input"
                            min="1"
                            max="31"
                        />
                        <select
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            required
                            className="input"
                        >
                            <option value="">Select Model</option>
                            <option value="CNN">CNN</option>
                            <option value="CNN_Attention">CNN + Attention</option>
                            <option value="RNN">RNN</option>
                            <option value="RNN_Attention">RNN + Attention</option>
                            <option value="GRU">GRU</option>
                            <option value="GRU_Attention">GRU + Attention</option>
                            <option value="LSTM">LSTM</option>
                            <option value="LSTM_Attention">LSTM + Attention</option>
                            <option value="ResNet">ResNet</option>
                            <option value="ResNet_Attention">ResNet + Attention</option>
                            <option value="ReXNet">ReXNet</option>
                            <option value="ReXNet_Attention">ReXNet + Attention</option>
                        </select>

                        <button type="submit" className="submit-button">
                            {loading ? "Loading..." : "Predict"}
                        </button>
                    </form>

                    {error && <p className="error-message">{error}</p>}

                    {result && !loading && (
                        <>
                            <div className="result-container">
                                <h2 className="result-title" style={{ marginTop: "20px" }}>Prediction Result</h2>
                                {Object.keys(result).map((model) => (
                                    <div key={model}>
                                        <h3>Model: {model}</h3>
                                        {result[model].error ? (
                                            <p>{result[model].error}</p>
                                        ) : (
                                            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", border: "1px solid #ddd" }}>
                                                <tbody>
                                                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                                                        <td style={{ padding: "8px", fontWeight: "bold", borderRight: "1px solid #ddd" }}>Prediction Date:</td>
                                                        <td style={{ padding: "8px" }}>{result[model].date}</td>
                                                    </tr>
                                                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                                                        <td style={{ padding: "8px", fontWeight: "bold", borderRight: "1px solid #ddd" }}>PM2.5 (μg/m3):</td>
                                                        <td style={{ padding: "8px" }}>{result[model].prediction['PM2.5'].toFixed(4)}</td>
                                                    </tr>
                                                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                                                        <td style={{ padding: "8px", fontWeight: "bold", borderRight: "1px solid #ddd" }}>PM10 (μg/m3):</td>
                                                        <td style={{ padding: "8px" }}>{result[model].prediction.PM10.toFixed(4)}</td>
                                                    </tr>
                                                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                                                        <td style={{ padding: "8px", fontWeight: "bold", borderRight: "1px solid #ddd" }}>SO2 (ppm):</td>
                                                        <td style={{ padding: "8px" }}>{result[model].prediction.SO2.toFixed(4)}</td>
                                                    </tr>
                                                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                                                        <td style={{ padding: "8px", fontWeight: "bold", borderRight: "1px solid #ddd" }}>CO (ppm):</td>
                                                        <td style={{ padding: "8px" }}>{result[model].prediction.CO.toFixed(4)}</td>
                                                    </tr>
                                                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                                                        <td style={{ padding: "8px", fontWeight: "bold", borderRight: "1px solid #ddd" }}>O3 (ppb):</td>
                                                        <td style={{ padding: "8px" }}>{result[model].prediction.O3.toFixed(4)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ padding: "8px", fontWeight: "bold", borderRight: "1px solid #ddd" }}>NO2 (ppm):</td>
                                                        <td style={{ padding: "8px" }}>{result[model].prediction.NO2.toFixed(4)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button onClick={handleReset} className="reset-button">
                                Reset
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
