import localFont from 'next/font/local';


export const digitalStrip = localFont({
    src: [
        {
            path: "../public/fonts/digitalstrip/DigitalStripBB_Reg.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../public/fonts/digitalstrip/DigitalStripBB_Ital.ttf",
            weight: "400",
            style: "italic",
        },
        {
            path: "../public/fonts/digitalstrip/DigitalStripBB_BoldItal.ttf",
            weight: "700",
            style: "italic",
        },
    ]
})

export const staatliches = localFont({
    src: [
        {
            path: "../public/fonts/staatliches/Staatliches-Regular.ttf",
            style: "normal",
        },
    ]
})

export const rocksalt = localFont({
    src: [
        {
            path: "../public/fonts/rocksalt/RockSalt-Regular.ttf",
            style: "normal",
        },
    ]
})