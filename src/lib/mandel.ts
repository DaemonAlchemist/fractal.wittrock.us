import { GPU } from 'gpu.js';
import {IPoint} from "./mandel.d";

// TODO: Update this to use arbitrary precision numbers
const gpu = new GPU();
export const drawMandel = (container:HTMLElement | null, center:IPoint, zoom:number, maxIter:number, width: number, height: number) => {
    if(!container) {return;}
    const render = gpu.createKernel(function(xCenter:number, yCenter:number, z:number, w:number, h:number, max:number){
        // Determine c for this point
        const ox = (this.thread.x - w/2) / z;
        const oy = (h/2 - this.thread.y) / z;
        const cx = ox + xCenter; // TODO: Losing precision here since ox << xCenter
        const cy = oy + yCenter; // TODO: Losing precision here since oy << yCenter

        // Initialize z and set iterations to zero
        let zx = 0.0;
        let zy = 0.0;
        let it = 0;

        // Run the iteration
        for(/* Initialized above */; it < max; it++) {
            // Determine if the point escaped
            const d:number = zx*zx + zy*zy;
            if(d > 4) {
                break;
            }

            // Get the next point
            let zxNew = zx * zx - zy * zy + cx;
            let zyNew = 2 * zx * zy + cy;
            zx = zxNew;
            zy = zyNew;
        }

        // Calculate the output color
        const i = it / 40; // it < max ? Math.log(it) / Math.log(max) : 0;
        const r = Math.cos(i * 2);
        const g = Math.sin(i * 4);
        // const r = Math.sin(cx * 8000000)/2 + 0.5;
        // const g = Math.sin(cy * 8000000)/2 + 0.5;
        const b = Math.sin(i * 8);

        // Color the pixel
        this.color(r, g, b, 1);
    })
        .setOutput([width, height])
        .setGraphical(true)
        .setTactic("precision")
        .setLoopMaxIterations(1000000);

    render(center.x, center.y, zoom, width, height, maxIter);
    container.replaceChildren(render.canvas);
}
