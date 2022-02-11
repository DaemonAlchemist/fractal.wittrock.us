import useMouse from '@react-hook/mouse-position';
import React, { useEffect, useRef, useState } from 'react';
import { drawMandel } from '../../lib/mandel';
import { IPoint } from '../../lib/mandel.d';
import useMultiKeyPress from '../../lib/useMultiKeyPress';
import { getCenter, origin } from '../../lib/util';
import { HomeProps } from "./Home.d";
import './Home.scss';

/*
TODO
    - Implement basic gradient handling
    - Implement gradient transfer function handling
    - Implement pan/zoom/rotate controls
    - Investigate precision issues
    - Implement real-time updates (is this needed?  Current implementation is instant down to a large zoom level)
*/

const width = window.innerWidth;
const height = window.innerHeight - 4;
const initialZoom = 300;

export const HomeComponent = (props:HomeProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [center, setCenter] = useState<IPoint>(origin);
    const [zoom, setZoom] = useState<number>(initialZoom);
    const [maxIterations, setMaxIterations] = useState<number>(2000);
    const mouse = useMouse(ref);
    const keysPressed = useMultiKeyPress();

    const curPoint = getCenter({...mouse, x: mouse.x || 0, y: mouse.y || 0}, zoom, center, width, height);

    useEffect(() => {
        drawMandel(ref.current, center, zoom, maxIterations, width, height);
    }, [center, zoom, maxIterations]);

    const zoomImage = () => {
        const f = keysPressed.includes("Shift") ? 1/1.2 : 1.2;
        setCenter({
            x: curPoint.x + (center.x - curPoint.x) / f,
            y: curPoint.y + (center.y - curPoint.y) / f,
        });
        setZoom(z => z * f);
    }

    return <>
        <div className="info">
            X: {curPoint.x}<br/>
            Y: {curPoint.y}<br/>
            Z: {zoom / initialZoom}<br/>
        </div>
        <div className="render-window" onClick={zoomImage}>
            <div ref={ref} />
        </div>
    </>;
}
