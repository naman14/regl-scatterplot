export default createScatterplot;
declare function createScatterplot(initialProperties?: Partial<import('./types').Properties>): {
    clear: () => void;
    createTextureFromUrl: (url: string) => Promise<import("regl").Texture2D>;
    deselect: ({ preventEvent }?: {
        preventEvent?: boolean;
    }) => void;
    destroy: () => void;
    draw: (newPoints: import('./types').Points, options?: import('./types').ScatterplotMethodOptions['draw']) => Promise<void>;
    get: <Key extends "camera" | "canvas" | "points" | "pointColor" | "pointColorActive" | "pointColorHover" | "pointOutlineWidth" | "pointSize" | "pointSizeSelected" | "pointConnectionColor" | "pointConnectionColorActive" | "pointConnectionColorHover" | "pointConnectionOpacity" | "pointConnectionOpacityActive" | "pointConnectionSize" | "pointConnectionSizeActive" | "pointConnectionMaxIntPointsPerSegment" | "pointConnectionTolerance" | "pointConnectionColorBy" | "pointConnectionOpacityBy" | "pointConnectionSizeBy" | "lassoColor" | "lassoLineWidth" | "lassoMinDelay" | "lassoMinDist" | "lassoClearEvent" | "lassoInitiator" | "lassoInitiatorParentElement" | "cameraTarget" | "cameraDistance" | "cameraRotation" | "cameraView" | "regl" | "syncEvents" | "version" | "lassoInitiatorElement" | "performanceMode" | "opacityByDensityDebounceTime" | "pointsInView" | keyof import("./types").BaseOptions>(property: Key) => import("./types").Properties[Key];
    hover: (point: number | number[], { showReticleOnce, preventEvent }?: import('./types').ScatterplotMethodOptions['hover']) => void;
    redraw: () => void;
    refresh: any;
    reset: (args_0?: Partial<{
        preventEvent: boolean;
    }>) => void;
    select: (pointIdxs: number | number[], { merge, preventEvent }?: import('./types').ScatterplotMethodOptions['select']) => void;
    set: (properties: Partial<import('./types').Settable>) => void;
    export: () => ImageData;
    subscribe: <EventName extends "view" | "destroy" | "points" | "lassoEnd" | "deselect" | "init" | "backgroundImageReady" | "lassoStart" | "transitionStart" | "pointConnectionsDraw" | "lassoExtend" | "pointOver" | "pointOut" | "transitionEnd" | "draw">(eventName: EventName, eventHandler: (payload: import("./types").EventMap[EventName]) => void, times: number) => void;
    unsubscribe: (eventName: "view" | "destroy" | "points" | "lassoEnd" | "deselect" | "init" | "backgroundImageReady" | "lassoStart" | "transitionStart" | "pointConnectionsDraw" | "lassoExtend" | "pointOver" | "pointOut" | "transitionEnd" | "draw") => void;
    view: (cameraView: number[], { preventEvent }?: import('./types').ScatterplotMethodOptions['preventEvent']) => void;
};
/**
 * Create a new Regl instance with `GL_EXTENSIONS` enables
 * @param   {HTMLCanvasElement}  canvas  Canvas element to be rendered on
 * @return  {import('regl').Regl}  New Regl instance
 */
export function createRegl(canvas: HTMLCanvasElement): import('regl').Regl;
export function createRenderer(options?: {}): {
    readonly canvas: any;
    readonly regl: any;
    gamma: any;
    render: (draw: any, targetCanvas: any) => void;
    onFrame: (draw: any) => () => void;
    refresh: () => void;
    destroy: () => void;
};
/**
 * @deprecated Please use `scatterplot.createTextureFromUrl(url)`
 *
 * Create a Regl texture from an URL.
 * @param   {import('regl').Regl}  regl  Regl instance used for creating the texture.
 * @param   {string}  url  Source URL of the image.
 * @return  {Promise<import('regl').Texture2D>}  Promise resolving to the texture object.
 */
export function createTextureFromUrl(regl: import('regl').Regl, url: string): Promise<import('regl').Texture2D>;
