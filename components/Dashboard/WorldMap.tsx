"use client"

import { Iso2ToCountryName, Iso2ToIso3, IsoCountryCode2 } from "@root/data/countryCodeLookup";
import worldCountries from "@root/data/world_countries.json";
import dynamic from "next/dynamic";

const ResponsiveChoropleth = dynamic(() => import("@nivo/geo").then(m => m.ResponsiveChoropleth), { ssr: false });

export const WorldMap = ({data}: {data: Array<{id: IsoCountryCode2; value: number}>}) => {
    return (
        <div className="relative h-full w-full">
            <ResponsiveChoropleth
                data={data.map(d => ({id: Iso2ToIso3[d.id], value: d.value}))}
                features={worldCountries.features}
                colors={"blues"}
                // domain={[ 0, Math.max(...data.map(d => d.value)) ]}
                domain={[ 0, 50 ]}
                margin={{ top: 40, right: 20, bottom: 0, left: 0 }}
                projectionTranslation={[ 0.5, 0.5 ]}
                projectionRotation={[ 0, 0, 0 ]}
                projectionScale={115}
                projectionType={"mercator"}
                enableGraticule={true}
                graticuleLineColor="#FFFFFF"
                borderWidth={0.5}
                borderColor="#152538"
                unknownColor="#BBBBBB"
                label="properties.name"
                valueFormat=".2s"
                legends={[{itemWidth: 20, itemHeight: 20, direction: "column", anchor: "bottom-left"}]}
            />
            <div className="absolute top-0 bg-white bg-opacity-80">
                <h1 className="text-md">Top countries</h1>
                <table className="text-sm">
                    <thead>
                        <tr className="border-b border-white-dark">
                            <th>Country</th>
                            <th>Visitors</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.slice(0,5).map((d, i) => (
                            <tr key={d.id} className="border-b border-white-dark">
                                <td>{`${i+1} ${Iso2ToCountryName[d.id]}`}</td>
                                <td className="text-center">{`${d.value}`}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}