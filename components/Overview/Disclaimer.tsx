"use server"
import Link from "next/link";

export const Disclaimer = () => {
    return (
        <div className="flex flex-row items-end justify-end md:px-0 px-5 md:py-0 py-5">
            <img src="/images/misc/ipcc-logo.png" className="w-16 " />
            <p className={`w-72 text-xs text-white text-right`}>
                The content for this experience was generated based on the <Link href="https://www.ipcc.ch/report/sixth-assessment-report-cycle/" className={"text-blue hover:text-blue-dark underline"} target="_blank">2023 IPCC Synthesis Report</Link>.
            </p>
        </div>
    )
}