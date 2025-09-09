"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import z from "zod";

const Mood = z.enum(["great", "good", "okay", "bad", "horrible"]);
type Mood = z.infer<typeof Mood>;

type OrderbyDayChartProps = {
    data: {
        date: string // Should be YYYY-MM-DD format
        mood: Mood
    }[]
}

export default function OrderByChat({data}: OrderbyDayChartProps) {
    // Define mood hierarchy (1 = worst, 5 = best)
    const moodToNumber = (mood: Mood): number => {
        const hierarchy = {
            "horrible": 1,
            "bad": 2,
            "okay": 3,
            "good": 4,
            "great": 5
        };
        return hierarchy[mood];
    };

    // Process and sort data by date
    const chartData = data
        .map(item => ({
            ...item,
            moodValue: moodToNumber(item.mood),
            // Format date for display (optional)
            displayDate: new Date(item.date).toLocaleDateString()
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort chronologically

    return (
        <ResponsiveContainer width="100%" minHeight={300}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="displayDate" 
                    tick={{ fontSize: 12 }}
                />
                <YAxis 
                    domain={[1, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tickFormatter={(value) => {
                        const labels = {1: "horrible", 2: "bad", 3: "okay", 4: "good", 5: "great"};
                        return labels[value as keyof typeof labels];
                    }}
                />
                <Tooltip 
                    formatter={(value: number) => {
                        const labels = {1: "horrible", 2: "bad", 3: "okay", 4: "good", 5: "great"};
                        return [labels[value as keyof typeof labels], "Mood"];
                    }}
                    labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line 
                    dataKey="moodValue" 
                    type="monotone" 
                    name="Daily Mood" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}