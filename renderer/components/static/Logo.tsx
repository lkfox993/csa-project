import * as React from 'react';
import Image, { ImageProps } from 'next/image'

export const Logo: React.FC<ImageProps> = (props) => {
    return (
        <Image {...props}/>
    )
}