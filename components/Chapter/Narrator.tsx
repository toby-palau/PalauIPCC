"use client"

import { digitalStrip } from "@root/styles/fonts"

type NarratorProps = {
    avatarImage: string;
    avatarText?: string;
    small?: boolean;
}

export const Narrator = ({ avatarImage, avatarText, small }: NarratorProps) => {
    return (
        <div className="fixed md:bottom-10 md:left-10 bottom-3 left-3 pointer-events-none z-10">
            { avatarText && (
                <div className="md:w-96 md:max-w-96 w-64 mb-4 p-4 relative border-2 border-black rounded bg-white">
                    <p className={`${digitalStrip.className} md:text-base text-sm text-black`}>
                        { avatarText }
                    </p>
                </div>
            ) }
            <img 
                src={`/images/avatars/${avatarImage}`}
                alt="avatar" 
                className={`${small && "scale-50"} md:h-56 md:w-56 h-24 w-24 rounded-full border-2 border-white transition-all duration-500 delay-75`}
            />
        </div>
    )
            }