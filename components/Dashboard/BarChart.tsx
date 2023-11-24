"use client"

import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'

export const BarChart = ({data}: {data: Array<{date: string; count: number}>}) => {
    return (
        <ResponsiveBar
            data={data}
            indexBy={"date"}
            keys={["count"]}
            margin={{ top: 50, right: 30, bottom: 50, left: 30 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'category10' }}
            labelSkipHeight={8}
            labelSkipWidth={8}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Time',
                legendPosition: 'middle',
                legendOffset: 32,
                truncateTickAt: 0
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Response count',
                legendPosition: 'middle',
                legendOffset: -40,
                truncateTickAt: 0
            }}
            enableLabel
            labelTextColor={"#FFFFFF"}
            borderRadius={4}
            // legends={[
            //     {
            //         dataFrom: 'keys',
            //         anchor: 'top-right',
            //         direction: 'column',
            //         justify: false,
            //         translateX: 120,
            //         translateY: 0,
            //         itemsSpacing: 2,
            //         itemWidth: 100,
            //         itemHeight: 20,
            //         itemDirection: 'left-to-right',
            //         itemOpacity: 0.85,
            //         symbolSize: 20,
            //         effects: [
            //             {
            //                 on: 'hover',
            //                 style: {
            //                     itemOpacity: 1
            //                 }
            //             }
            //         ]
            //     }
            // ]}
        />
    )
}