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

export const dmsans = localFont({
    src: [
        {
            path: "../public/fonts/dmsans/DMSans-VariableFont_opsz,wght.ttf",
            style: "normal",
        },
        {
            path: "../public/fonts/dmsans/DMSans-Italic-VariableFont_opsz,wght.ttf",
            style: "italic",
        }
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