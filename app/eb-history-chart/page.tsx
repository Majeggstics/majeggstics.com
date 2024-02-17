"use client";

import { useState } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { timeFormat } from 'd3-time-format';

// import './App.css'
// import archives from './archives.json';

// Define your date format
const formatDate = timeFormat("%Y-%m-%d");

// console.log('data', archives.archiveList, data);
// console.log('data', data);

const DataFormater = (number) => {
    if (number > Math.pow(10, 15)) {
        return number;
    }
    else if (number > Math.pow(10, 12)) {
        return (number / Math.pow(10, 12)).toString() + 'T';
    } else if (number > Math.pow(10, 9)) {
        return (number / Math.pow(10, 9)).toString() + 'B';
    } else if (number > Math.pow(10, 6)) {
        return (number / Math.pow(10, 6)).toString() + 'M';
    } else if (number > Math.pow(10, 3)) {
        return (number / Math.pow(10, 3)).toString() + 'K';
    }
    return number;
}

function EbHistoryChart() {
    const [EID, setEID] = useState("");
    const [data, setData] = useState({});

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    async function fetchData() {
        const response = await fetch(`${API_URL}/archive?EID=${EID}`);

        const data = await response.json();
        console.log('data', data);

        setData(() => {
            const newData = data.archiveList.map((archive, index) => {
                return (
                    {
                        EB: (100 * Math.pow(10, archive.evaluation.soulPower)),
                        date: new Date(archive.contract.startTime * 1000),
                        contractIdentifier: archive.evaluation.contractIdentifier
                    }
                )
            }).reverse();
            return newData;
        });
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', width: "250px" }}>
                <input type="text" onChange={(event) => setEID(event.target.value)} placeholder='Please enter your EID' />

                <button onClick={fetchData} style={{ backgroundColor: "dodgerblue", color: "navy", margin: '1rem 0' }}>Fetch</button>
            </div>
            <LineChart width={1200} height={600} data={data}>
                <Line type="monotone" dataKey="EB" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                {/* <XAxis dataKey="date" /> */}
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis scale="log" domain={[Math.pow(10, 9), Math.pow(10, 33)]} tickFormatter={DataFormater} />
                <Tooltip />
                {/* <YAxis domain={[Math.pow(10, 9), 'dataMax']} /> */}
                {/* <YAxis ticks={[Math.pow(10, 9), Math.pow(10, 12), Math.pow(10, 15), Math.pow(10, 18), Math.pow(10, 21), Math.pow(10, 24), Math.pow(10, 27), Math.pow(10, 30), Math.pow(10, 33),]} /> */}
                {/* <YAxis ticks={[0, 20, 40, 60, 80, 100]}  /> */}
            </LineChart>

        </>
    )
}

export default EbHistoryChart;