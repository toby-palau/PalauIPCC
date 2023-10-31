"use client"

import Image from "next/image";
import { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Image>, "src"> & {src: string};

export const PalauImage = (props: Props) => {
    const src = require(`@root/assets/images/${props.src}`);

    return <Image { ...props } src={src} />;
}