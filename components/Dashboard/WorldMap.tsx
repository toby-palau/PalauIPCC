"use client"

import worldCountries from "./world_countries.json";
import dynamic from "next/dynamic";

const ResponsiveChoropleth = dynamic(() => import("@nivo/geo").then(m => m.ResponsiveChoropleth), { ssr: false });

const data = [
    {
        "id": "AFG",
        "value": 879307
    },
    {
        "id": "AGO",
        "value": 835265
    },
    {
        "id": "ALB",
        "value": 980798
    },
    {
        "id": "ARE",
        "value": 19509
    },
    {
        "id": "ARG",
        "value": 760059
    },
    {
        "id": "ARM",
        "value": 971859
    },
    {
        "id": "ATA",
        "value": 185997
    },
    {
        "id": "ATF",
        "value": 971173
    },
    {
        "id": "AUT",
        "value": 159405
    },
    {
        "id": "AZE",
        "value": 877113
    },
    {
        "id": "BDI",
        "value": 266019
    },
    {
        "id": "BEL",
        "value": 669086
    },
    {
        "id": "BEN",
        "value": 59522
    },
    {
        "id": "BFA",
        "value": 724505
    },
    {
        "id": "BGD",
        "value": 920485
    },
    {
        "id": "BGR",
        "value": 638601
    },
    {
        "id": "BHS",
        "value": 966073
    },
    {
        "id": "BIH",
        "value": 490302
    },
    {
        "id": "BLR",
        "value": 183311
    },
    {
        "id": "BLZ",
        "value": 811706
    },
    {
        "id": "BOL",
        "value": 919901
    },
    {
        "id": "BRN",
        "value": 619100
    },
    {
        "id": "BTN",
        "value": 203523
    },
    {
        "id": "BWA",
        "value": 863845
    },
    {
        "id": "CAF",
        "value": 263322
    },
    {
        "id": "CAN",
        "value": 447099
    },
    {
        "id": "CHE",
        "value": 537553
    },
    {
        "id": "CHL",
        "value": 670702
    },
    {
        "id": "CHN",
        "value": 62187
    },
    {
        "id": "CIV",
        "value": 654688
    },
    {
        "id": "CMR",
        "value": 914731
    },
    {
        "id": "COG",
        "value": 288967
    },
    {
        "id": "COL",
        "value": 752940
    },
    {
        "id": "CRI",
        "value": 989766
    },
    {
        "id": "CUB",
        "value": 662768
    },
    {
        "id": "-99",
        "value": 49600
    },
    {
        "id": "CYP",
        "value": 910903
    },
    {
        "id": "CZE",
        "value": 505690
    },
    {
        "id": "DEU",
        "value": 975231
    },
    {
        "id": "DJI",
        "value": 409679
    },
    {
        "id": "DNK",
        "value": 33719
    },
    {
        "id": "DOM",
        "value": 771887
    },
    {
        "id": "DZA",
        "value": 834372
    },
    {
        "id": "ECU",
        "value": 976459
    },
    {
        "id": "EGY",
        "value": 399807
    },
    {
        "id": "ERI",
        "value": 916818
    },
    {
        "id": "ESP",
        "value": 478518
    },
    {
        "id": "EST",
        "value": 342677
    },
    {
        "id": "ETH",
        "value": 833668
    },
    {
        "id": "FIN",
        "value": 89112
    },
    {
        "id": "FJI",
        "value": 558298
    },
    {
        "id": "FLK",
        "value": 446743
    },
    {
        "id": "FRA",
        "value": 301620
    },
    {
        "id": "GAB",
        "value": 363431
    },
    {
        "id": "GBR",
        "value": 341216
    },
    {
        "id": "GEO",
        "value": 351727
    },
    {
        "id": "GHA",
        "value": 101271
    },
    {
        "id": "GIN",
        "value": 118754
    },
    {
        "id": "GMB",
        "value": 637511
    },
    {
        "id": "GNB",
        "value": 96446
    },
    {
        "id": "GNQ",
        "value": 618346
    },
    {
        "id": "GRC",
        "value": 491523
    },
    {
        "id": "GTM",
        "value": 72139
    },
    {
        "id": "GUY",
        "value": 616291
    },
    {
        "id": "HND",
        "value": 745945
    },
    {
        "id": "HRV",
        "value": 800042
    },
    {
        "id": "HTI",
        "value": 236806
    },
    {
        "id": "HUN",
        "value": 721238
    },
    {
        "id": "IDN",
        "value": 112520
    },
    {
        "id": "IND",
        "value": 834106
    },
    {
        "id": "IRL",
        "value": 18976
    },
    {
        "id": "IRN",
        "value": 765616
    },
    {
        "id": "IRQ",
        "value": 140729
    },
    {
        "id": "ISL",
        "value": 850524
    },
    {
        "id": "ISR",
        "value": 792360
    },
    {
        "id": "ITA",
        "value": 590229
    },
    {
        "id": "JAM",
        "value": 881810
    },
    {
        "id": "JOR",
        "value": 958296
    },
    {
        "id": "JPN",
        "value": 110864
    },
    {
        "id": "KAZ",
        "value": 242515
    },
    {
        "id": "KEN",
        "value": 286163
    },
    {
        "id": "KGZ",
        "value": 258457
    },
    {
        "id": "KHM",
        "value": 270306
    },
    {
        "id": "OSA",
        "value": 765140
    },
    {
        "id": "KWT",
        "value": 590014
    },
    {
        "id": "LAO",
        "value": 306171
    },
    {
        "id": "LBN",
        "value": 821581
    },
    {
        "id": "LBR",
        "value": 457682
    },
    {
        "id": "LBY",
        "value": 910625
    },
    {
        "id": "LKA",
        "value": 759613
    },
    {
        "id": "LSO",
        "value": 966701
    },
    {
        "id": "LTU",
        "value": 886810
    },
    {
        "id": "LUX",
        "value": 727638
    },
    {
        "id": "LVA",
        "value": 349439
    },
    {
        "id": "MAR",
        "value": 343479
    },
    {
        "id": "MDA",
        "value": 36453
    },
    {
        "id": "MDG",
        "value": 375298
    },
    {
        "id": "MEX",
        "value": 228572
    },
    {
        "id": "MKD",
        "value": 19693
    },
    {
        "id": "MLI",
        "value": 315143
    },
    {
        "id": "MMR",
        "value": 157193
    },
    {
        "id": "MNE",
        "value": 907581
    },
    {
        "id": "MNG",
        "value": 411479
    },
    {
        "id": "MOZ",
        "value": 31390
    },
    {
        "id": "MRT",
        "value": 558875
    },
    {
        "id": "MWI",
        "value": 467796
    },
    {
        "id": "MYS",
        "value": 589645
    },
    {
        "id": "NAM",
        "value": 191206
    },
    {
        "id": "NCL",
        "value": 522596
    },
    {
        "id": "NER",
        "value": 984450
    },
    {
        "id": "NGA",
        "value": 831749
    },
    {
        "id": "NIC",
        "value": 877067
    },
    {
        "id": "NLD",
        "value": 943641
    },
    {
        "id": "NOR",
        "value": 179182
    },
    {
        "id": "NPL",
        "value": 85520
    },
    {
        "id": "NZL",
        "value": 648477
    },
    {
        "id": "OMN",
        "value": 162162
    },
    {
        "id": "PAK",
        "value": 232496
    },
    {
        "id": "PAN",
        "value": 891518
    },
    {
        "id": "PER",
        "value": 954988
    },
    {
        "id": "PHL",
        "value": 589119
    },
    {
        "id": "PNG",
        "value": 181246
    },
    {
        "id": "POL",
        "value": 731470
    },
    {
        "id": "PRI",
        "value": 331820
    },
    {
        "id": "PRT",
        "value": 448191
    },
    {
        "id": "PRY",
        "value": 467508
    },
    {
        "id": "QAT",
        "value": 270725
    },
    {
        "id": "ROU",
        "value": 264509
    },
    {
        "id": "RUS",
        "value": 421090
    },
    {
        "id": "RWA",
        "value": 940619
    },
    {
        "id": "ESH",
        "value": 450509
    },
    {
        "id": "SAU",
        "value": 629586
    },
    {
        "id": "SDN",
        "value": 391906
    },
    {
        "id": "SDS",
        "value": 412605
    },
    {
        "id": "SEN",
        "value": 377946
    },
    {
        "id": "SLB",
        "value": 225624
    },
    {
        "id": "SLE",
        "value": 336030
    },
    {
        "id": "SLV",
        "value": 413055
    },
    {
        "id": "ABV",
        "value": 308980
    },
    {
        "id": "SOM",
        "value": 261876
    },
    {
        "id": "SRB",
        "value": 228585
    },
    {
        "id": "SUR",
        "value": 754713
    },
    {
        "id": "SVK",
        "value": 88684
    },
    {
        "id": "SVN",
        "value": 294927
    },
    {
        "id": "SWZ",
        "value": 761358
    },
    {
        "id": "SYR",
        "value": 867411
    },
    {
        "id": "TCD",
        "value": 818194
    },
    {
        "id": "TGO",
        "value": 843162
    },
    {
        "id": "THA",
        "value": 309991
    },
    {
        "id": "TJK",
        "value": 900863
    },
    {
        "id": "TKM",
        "value": 295544
    },
    {
        "id": "TLS",
        "value": 189949
    },
    {
        "id": "TTO",
        "value": 115378
    },
    {
        "id": "TUN",
        "value": 821221
    },
    {
        "id": "TUR",
        "value": 698588
    },
    {
        "id": "TWN",
        "value": 520588
    },
    {
        "id": "TZA",
        "value": 619459
    },
    {
        "id": "UGA",
        "value": 546323
    },
    {
        "id": "UKR",
        "value": 60045
    },
    {
        "id": "URY",
        "value": 752355
    },
    {
        "id": "USA",
        "value": 663811
    },
    {
        "id": "UZB",
        "value": 173296
    },
    {
        "id": "VEN",
        "value": 87791
    },
    {
        "id": "VNM",
        "value": 184897
    },
    {
        "id": "VUT",
        "value": 964241
    },
    {
        "id": "PSE",
        "value": 158577
    },
    {
        "id": "YEM",
        "value": 936368
    },
    {
        "id": "ZAF",
        "value": 52692
    },
    {
        "id": "ZMB",
        "value": 367510
    },
    {
        "id": "ZWE",
        "value": 719173
    },
    {
        "id": "KOR",
        "value": 399891
    }
];

export const WorldMap = () => {
    return (
        <ResponsiveChoropleth
            data={data}
            features={worldCountries.features}
            domain={[ 0, 1000000 ]}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            projectionTranslation={[ 0.5, 0.5 ]}
            projectionRotation={[ 0, 0, 0 ]}
            projectionType={"equalEarth"}
            enableGraticule={true}
            graticuleLineColor="#DDDDDD"
            borderWidth={0.5}
            borderColor="#152538"
            unknownColor="#666666"
            label="properties.name"
            valueFormat=".2s"
        />
    )
}