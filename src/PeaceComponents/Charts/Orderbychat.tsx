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
        Title: "14 days",
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

    const getFilteredData = () => {
        const now = new Date();

        switch (SelectedPeriod) {
            case "7 days":
                const weekago = new Date();
                weekago.setDate(now.getDate() - 7);
                return alldata.filter(item => new Date(item.date) >= weekago);

            case "14 days":
                const twoWeeksAgo = new Date();
                twoWeeksAgo.setDate(now.getDate() - 14);
                return alldata.filter(item => new Date(item.date) >= twoWeeksAgo);

            case "Month":
                const monthAgo = new Date();
                monthAgo.setMonth(now.getMonth() - 1);
                return alldata.filter(entry => new Date(entry.date) >= monthAgo);

            case "Max":
            default:
                return alldata;


        }
    };
    const filterdata = getFilteredData();


    const chartData = filterdata
        .map(item => ({
            ...item,
            moodValue: mooodtoNumber(item.mood as Mood),
            displayDate: new Date(item.date).toLocaleDateString(),
            fullDate: new Date(item.date).toLocaleDateString(),
        }))
        .sort((a, b) => a.date.localeCompare(b.date));


    const handleChartClick = (title: string) => {
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
    }
}

const handlePeriodClick = (title: string) => {
    setSelectedPeriod(title);
    switch (title) {
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

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-700">{`Date: ${label}`}</p>
                    <p className="text-blue-600 font-medium">
                        {`Mood: ${numberToMood(payload[0].value)}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    const RenderSelectedChart = () => {
        switch (selectedGraph) {
            case "BarGraph":

                return (
                    <div className="space-y-2 w-full">

                        <ResponsiveContainer width={"100%"} minHeight={300}>
                            <BarChart data={chartData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barSize={30}>
                                <XAxis dataKey="displayDate" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                                <Tooltip content={<CustomTooltip />} />
                                <YAxis
                                    domain={[1, 5]}
                                    tickFormatter={numberToMood}
                                    ticks={[1, 2, 3, 4, 5]}
                                    tick={{ fontSize: 12 }}
                                />
                                <Bar dataKey="moodValue" name="mood" fill="#6366f1" activeBar={<Rectangle stroke="blue" />} radius={[4, 4, 0, 0]} >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={moodToColor[entry.mood as Mood]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>


                );


            case "PieChart":
                const CustomPieTooltip = ({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                <p className="font-semibold text-gray-700 capitalize">{`${data.name}`}</p>
                                <p className="text-blue-600 font-medium">{`Count: ${data.count}`}</p>
                                <p className="text-green-600 font-medium">{`${data.percentage}%`}</p>
                            </div>
                        );
                    }
                    return null;
                };
                const moodCounts = filterdata.reduce((acc, item) => {
                    const mood = item.mood as Mood;
                    acc[mood] = (acc[mood] || 0) + 1;
                    return acc;
                }, {} as Record<Mood, number>);

                const pieData = Object.entries(moodCounts).map(([mood, count]) => ({
                    name: mood,
                    count: count,
                    percentage: ((count / filterdata.length) * 100).toFixed(1)


                }));
                return (
                    <div className="space-y-2">
                        <ResponsiveContainer width={"100%"} minHeight={300}>
                            <PieChart >
                                <Pie dataKey={"count"} cx="50%" cy="50%" outerRadius={120} innerRadius={60} fill="#8884d8" label={({ name, percentage }) => `${name}: ${percentage}%`} data={pieData} nameKey="name" stroke="#fff"
                                    strokeWidth={2} >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={moodToColor[entry.name as Mood]} />
                                    ))}

                                </Pie>
                                <Tooltip content={CustomPieTooltip} />


                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                );

            case "AreaChart":
                return (
                    <div className="space-y-2">
                        <ResponsiveContainer width={"100%"} minHeight={300}>
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0, }}>
                                <defs>
                                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="displayDate"
                                    tick={{ fontSize: 12 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <Tooltip content={CustomTooltip} />
                                <YAxis
                                    domain={[1, 5]}
                                    tickFormatter={numberToMood}
                                    ticks={[1, 2, 3, 4, 5]}
                                    tick={{ fontSize: 12 }}
                                />
                                <Area type="monotone"
                                    dataKey="moodValue"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fill="url(#moodGradient)"
                                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2 }} />
                            </AreaChart>
                        </ResponsiveContainer>

                    </div>

                );

            default:
                return (
                    <div className="space-y-2">
                        <ResponsiveContainer width="100%" minHeight={300}>
                            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20 }}>
                                <XAxis
                                    dataKey="displayDate"
                                    tick={{ fontSize: 12 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis
                                    domain={[1, 5]}
                                    tickFormatter={numberToMood}
                                    ticks={[1, 2, 3, 4, 5]}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip content={CustomTooltip} />
                                <Legend />
                                <Line
                                    dataKey="moodValue"
                                    type="monotone"
                                    name="Mood"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2, fill: '#fff' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )
        }

    }

    return (
        <div className="space-y-3 w-full">
            <Card className="bg-transparent border-none">
                <CardContent className="space-y-3">
                    {/* Chart Type Selection */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Chart Type: <span className="text-primary font-semibold">{selectedGraph}</span>
                        </h3>
                        <div className="grid grid-cols-4 gap-1">
                            {ButtonsChart.map((button) => (
                                <Button 
                                    key={button.Title} 
                                    variant={selectedGraph === button.Title ? "default" : "outline"} 
                                    size="sm"
                                    className="h-8  text-xs font-medium"
                                    onClick={() => handleChartClick(button.Title)}
                                >
                                    <button.icon className="mr-1 h-3 w-3" />
                                    <span className="hidden sm:inline">{button.Title}</span>
                                    <span className="sm:hidden">{button.Title.slice(0, 4)}</span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Time Period Selection */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Time Period: <span className="text-primary font-semibold">{SelectedPeriod}</span>
                        </h3>
                        <div className="grid grid-cols-4 gap-1">
                            {Daysbuttons.map((button) => (
                                <Button 
                                    key={button.Title} 
                                    variant={SelectedPeriod === button.Title ? "default" : "outline"} 
                                    size="sm"
                                    className="h-8 px-2 text-xs font-medium"
                                    onClick={() => handlePeriodClick(button.Title)}
                                >
                                    <button.icon className="mr-1 h-3 w-3" />
                                    <span>{button.Title}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            {/* Chart Display */}
            <div className="bg-transparent rounded-lg p-2">
                {RenderSelectedChart()}
            </div>
        </div>
    )
}