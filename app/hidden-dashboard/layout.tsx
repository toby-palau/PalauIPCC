
import React from "react";
import Head from "next/head";
import { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false } }

export default function Layout({ children }: {children: React.ReactNode}) {
    return (
        <div>
            <Head>
                <meta name="robots" content="noindex,nofollow" />
            </Head>
            {children}
        </div>
    );
};

