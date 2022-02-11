import { IPoint } from "./mandel.d";

export const origin:IPoint = {x: 0, y: 0};

export const getCenter = (point:IPoint, zoom:number, center:IPoint, width:number, height: number):IPoint => ({
    x: (point.x - width/2) / zoom + center.x,
    y: (point.y - height/2) / zoom + center.y,
})
