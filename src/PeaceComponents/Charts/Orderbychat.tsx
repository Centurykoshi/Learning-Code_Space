"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import { Title } from "@radix-ui/react-dialog";
import { Item } from "@radix-ui/react-dropdown-menu";
import { Value } from "@radix-ui/react-select";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { AreaChartIcon, BarChartIcon, CalendarDaysIcon, LineChartIcon, PieChartIcon, } from "lucide-react";
import { useState } from "react";
import { Day } from "react-day-picker";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, Pie, PieChart, AreaChart, Area, } from "recharts";
import { toast } from "sonner";
import z from "zod";

const Mood = z.enum(["great", "good", "okay", "bad", "horrible"]);
type Mood = z.infer<typeof Mood>;

export default function OrderByChat() {
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    const { data: alldata, isPending, error } = useQuery(trpc.moodRespone.getAllMood.queryOptions(

    ));

    const moodToColor: Record<Mood, string> = {
        horrible: '#ff6b6b',
        bad: '#6394d4',
        okay: '#96ceb4',
        good: '#af5dcf',
        great: '#feca57',
    };

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

    const ButtonsChart = [{
        Title: "LineGraph", icon: LineChartIcon
    },

    { Title: "BarGraph", icon: BarChartIcon },

    {
        Title: "PieChart",
        icon: PieChartIcon
    },

    {
        Title: "AreaChart",
        icon: AreaChartIcon
    }
    ]

    const Daysbuttons = [{
        Title: "7 days",
        icon: CalendarDaysIcon
    },

    {
        Title: "14 days ",
        icon: CalendarDaysIcon
    },

    {
        Title: "Month",
        icon: CalendarDaysIcon
    },

    {
        Title: "Max",
        icon: CalendarDaysIcon
    }
    ]


    const [selectedGraph, setSelectedGraph] = useState<string>("LineGraph");
    const [SelectedPeriod, setSelectedPeriod] = useState<string>("7 days");




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


    const handleClick = (title: string) => {
        setSelectedGraph(title);
        switch (title) {
            case "LineGraph":
                toast.success("Get better you clicked on line graph")
                break;

            case "BarGraph":
                toast.success("Get better you clicked on Bar graph")
                break;
            case "PieChart":
                toast.success("Get better you clicked on Pie chart")
                break;
            case "AreaChart":
                toast.success("Get better you clicked on Area chart")
                break;
            case "7 days":
                toast.success("Get better you clicked on 7 days")
                break;
            case "14 days":
                toast.success("Get better you clicked on 14 days")
                break;
            case "Month":
                toast.success("Get better you clicked on Month")
                break;
            case "Max":
                toast.success("Get Better you clicked on MAX")
                break;
        }
    }

    const RenderSelectedChart = () => {
        switch (selectedGraph) {
            case "BarGraph":

                return (
                    <div className="space-y-2 w-full">

                        <ResponsiveContainer width={"100%"} minHeight={300}>
                            <BarChart data={chartData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barSize={20}>
                                <XAxis dataKey="displayDate" />
                                <Tooltip labelFormatter={(label) => "Date :" + label}
                                    formatter={(value: number) => [numberToMood(value), "Mood"]} />
                                <YAxis
                                    domain={[1, 5]}
                                    tickFormatter={numberToMood}
                                    ticks={[1, 2, 3, 4, 5]}
                                />
                                <Bar dataKey="moodValue" name="mood" fill="#8884d8" activeBar={<Rectangle stroke="blue" />} radius={[4, 4, 0, 0]} type="monotone" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>


                );


            case "PieChart":
                return (
                    <div className="space-y-2">
                        <ResponsiveContainer width={"100%"} minHeight={300}>
                            <PieChart >
                                <Pie dataKey={"moodValue"} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label data={chartData} nameKey="mood" >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={moodToColor[entry.mood as keyof typeof moodToColor]} />
                                    ))}

                                </Pie>
                                <Tooltip labelFormatter={(label) => "Date : " + label}
                                    formatter={(value: number) => [numberToMood(value), "Mood"]} />


                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                );

            case "AreaChart":
                return (
                    <div className="space-y-2">
                        <ResponsiveContainer width={"100%"} minHeight={300}>
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0, }}>
                                <XAxis dataKey="displayDate" />
                                <Tooltip labelFormatter={(label) => "Date : " + label}
                                    formatter={(value: number) => [numberToMood(value), "Mood"]} />
                                <YAxis domain={[1, 5]} tickFormatter={numberToMood} ticks={[1, 2, 3, 4, 5]} />
                                <Area type={"monotone"} dataKey="moodValue" stroke="#8884d8" fillOpacity={0.3} />
                            </AreaChart>
                        </ResponsiveContainer>

                    </div>

                );

            default:
                return (
                    <div className="space-y-2">
                        <ResponsiveContainer width="100%" minHeight={300}>
                            <LineChart data={chartData}>

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
                                <Line dataKey="moodValue" type={"monotone"} name="Mood" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>

                    </div>


                )
        }

    }

    return (
        <div className="space-y-2 w-full">
            <Card>
                <CardContent className="grid grid-cols-4">
                    {ButtonsChart.map((button) => {
                        return (

                            <Button key={button.Title} variant="outline" className="m-2 text-sm " onClick={() => handleClick(button.Title)} >
                                <button.icon className="mr-2 h-2 w-2" />
                                {button.Title}
                            </Button>
                        );
                    })}

                    {Daysbuttons.map((button) => (
                        <Button key={button.Title} variant="outline" className="m-2 text-sm ">
                            <button.icon className="mr-2 h-2 w-2" />
                            {button.Title}
                        </Button>
                    ))}

                </CardContent>
            </Card>
            {RenderSelectedChart()}


        </div>

    )
}