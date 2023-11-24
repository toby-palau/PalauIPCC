
import React from 'react';
import Head from 'next/head';

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

