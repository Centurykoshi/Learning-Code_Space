"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import z from "zod";

const Mood = z.enum(["great", "good", "okay", "bad", "horrible"]);
type Mood = z.infer<typeof Mood>;

export default function OrderByChat() {
    const trpc = useTRPC();
    const { data: alldata, isPending, error } = useQuery(trpc.moodRespone.getAllMood.queryOptions());

    const mooodtoNumber = (m: Mood) => {
        const hierarchy = {
            "horrible": 1,
            "bad": 2,
            "okay": 3,
            "good": 4,
            "great": 5,
        }
        return hierarchy[m];
    }

    // Convert numbers back to mood names for display
    const numberToMood = (value: number) => {
        const moodNames = {
            1: "horrible",
            2: "bad", 
            3: "okay",
            4: "good",
            5: "great"
        };
        return moodNames[value as keyof typeof moodNames] || value.toString();
    }

    // Handle loading and error states
    if (isPending) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;
    if (!alldata || !Array.isArray(alldata)) return <div>No data available</div>;

    const chartData = alldata
        .map(item => ({
            ...item,
            moodValue: mooodtoNumber(item.mood as Mood),
            displayDate: new Date(item.date).toLocaleDateString(),
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

    return (
        <ResponsiveContainer width="100%" minHeight={300}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="displayDate" />
                <YAxis 
                    domain={[1, 5]}
                    tickFormatter={numberToMood}
                    ticks={[1, 2, 3, 4, 5]}
                />
                <Tooltip 
                    labelFormatter={(label) => `Date: ${label}`}
                    formatter={(value: number) => [numberToMood(value), "Mood"]}
                />
                <Legend />
                <Line dataKey="moodValue" type={"monotone"} name="Mood" stroke="brown" dot={false} />
            </LineChart>
        </ResponsiveContainer>
    )
}