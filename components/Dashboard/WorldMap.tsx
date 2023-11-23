"use client"

import worldCountries from "@root/data/world_countries.json";
import dynamic from "next/dynamic";

const ResponsiveChoropleth = dynamic(() => import("@nivo/geo").then(m => m.ResponsiveChoropleth), { ssr: false });

export const WorldMap = ({data}: {data: Array<{id: string; value: number}>}) => {
    return (
        <ResponsiveChoropleth
            data={data}
            features={worldCountries.features}
            domain={[ 0, Math.max(...data.map(d => d.value)) ]}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            projectionTranslation={[ 0.5, 0.5 ]}
            projectionRotation={[ 0, 0, 0 ]}
            projectionType={"equalEarth"}
            enableGraticule={true}
            graticuleLineColor="#DDDDDD"
            borderWidth={0.5}
            borderColor="#152538"
            unknownColor="#CCCCCC"
            label="properties.name"
            valueFormat=".2s"
        />
    )
}