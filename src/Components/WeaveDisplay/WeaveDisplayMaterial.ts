import * as THREE from "three";
import {extend} from "@react-three/fiber"
import { DataTexture } from "three";
import { shaderMaterial } from "@react-three/drei";

const defaultDataBuffer = new Uint8Array(3);

export const WeaveDisplayMaterial = shaderMaterial(
    {
        patternDataTexture: new DataTexture(defaultDataBuffer,1,1,THREE.RGBFormat),
        repeats: 1
    },
    `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
    `varying vec2 vUv;
uniform float repeats;
uniform sampler2D patternDataTexture;
void main() {
    vec2 uv = vUv * repeats;
    uv = uv - floor(uv);
    gl_FragColor.rgba = texture2D(patternDataTexture, uv);
    gl_FragColor.a = 1.;
}
`
)

extend({ WeaveDisplayMaterial })

type WeaveDisplayMaterialImplementation = {
    patternDataTexture: DataTexture
    repeats: number
  } & JSX.IntrinsicElements['shaderMaterial']
  
  
declare global {
    namespace JSX {
        interface IntrinsicElements {
            weaveDisplayMaterial: WeaveDisplayMaterialImplementation
        }
    }
}