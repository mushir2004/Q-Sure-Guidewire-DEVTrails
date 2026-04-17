"use client";

import dynamic from "next/dynamic";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

const ChartWrapper = dynamic(() => Promise.resolve(({ data }: { data: any[] }) => (
    <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.2)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
            <Radar name="Telemetry" dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.5} />
        </RadarChart>
    </ResponsiveContainer>
)), { ssr: false });

export default ChartWrapper;