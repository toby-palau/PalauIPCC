import localFont from 'next/font/local';


export const digitalStrip = localFont({
    src: [
        {
            path: "../assets/fonts/digitalstrip/DigitalStripBB_Reg.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../assets/fonts/digitalstrip/DigitalStripBB_Ital.ttf",
            weight: "400",
            style: "italic",
        },
        {
            path: "../assets/fonts/digitalstrip/DigitalStripBB_BoldItal.ttf",
            weight: "700",
            style: "italic",
        },
    ]
})

export const dmsans = localFont({
    src: [
        {
            path: "../assets/fonts/dmsans/DMSans-VariableFont_opsz,wght.ttf",
            style: "normal",
        },
        {
            path: "../assets/fonts/dmsans/DMSans-Italic-VariableFont_opsz,wght.ttf",
            style: "italic",
        }
    ]
})