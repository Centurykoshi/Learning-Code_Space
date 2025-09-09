"use client";

import { Line, LineChart } from "recharts";

const data = [
    { value: 12, date: "2023-12-2" },
    { value: 2, date: "2023-12-4" },
    { value: 22, date: "2023-12-3" },
]

export default function OrderByChat() {

    return (<LineChart width={500} height={300} data={data}>
        <Line dataKey="value" />
        hi

    </LineChart>
    )

}