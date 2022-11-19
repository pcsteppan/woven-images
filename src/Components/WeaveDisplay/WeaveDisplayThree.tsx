import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Mesh } from 'three';
import { rFromHexString, bFromHexString, gFromHexString } from '../../utils';
import './CustomBlurEffect.js';
import "./WeaveDisplayMaterial";

import { useThree } from '@react-three/fiber'
import { CameraMode } from '../../types';

function Foo() {
    const state = useThree();
    return state;
}

const createPatternDataTexture = (width: number, height: number, buffer: string[]) => {
    const size = width * height;
    const patternData = new Uint8Array(3 * size);

    for (let i = 0; i < size; i++) {
        const stride = i * 3;

        const r = rFromHexString(buffer[i]);
        const g = gFromHexString(buffer[i]);
        const b = bFromHexString(buffer[i]);

        patternData[stride] = r;
        patternData[stride + 1] = g;
        patternData[stride + 2] = b;
    }

    const patternTexture = new THREE.DataTexture(patternData, width, height, THREE.RGBFormat);
    return patternTexture;
}

interface SceneProps {
    warpThreadCount: number,
    weftThreadCount: number,
    unitSize: number,
    repeats: number,
    colorBuffer: string[],
    cameraMode: CameraMode
}

const initialPatternDataTexture = createPatternDataTexture(2, 2, ["#ffffff", "#000000", "#ffffff", "#000000"]);

function Scene(props: SceneProps) {
    const myMesh = useRef<Mesh>();
    const perspectiveCameraRef = useRef<typeof PerspectiveCamera>();
    const [patternDataTexture, setPatternDataTexture] = useState(initialPatternDataTexture);
    const threeState = Foo();

    const max = () => Math.max(props.warpThreadCount, props.weftThreadCount);
    const perspectivePlaneWidth = () => (props.warpThreadCount / max());
    const perspectivePlaneHeight = () => (props.weftThreadCount / max());
    const aspect = () => (perspectivePlaneWidth() / perspectivePlaneHeight());
    const vFov = () => Math.atan(perspectivePlaneHeight() / 2) * (360 / Math.PI);
    const hFov = () => 2 * Math.atan(Math.tan(vFov() * Math.PI / 180 / 2) * aspect()) * 180 / Math.PI;

    useEffect(() => {
        setPatternDataTexture(createPatternDataTexture(props.warpThreadCount, props.weftThreadCount, props.colorBuffer));
        patternDataTexture.needsUpdate = true;
        if ("fov" in threeState.camera) {
            threeState.camera.fov = vFov();
        }
    }, [props]);

    const canvasWidth = props.warpThreadCount * props.unitSize;
    const canvasHeight = props.weftThreadCount * props.unitSize;

    const enableOrbitControls = props.cameraMode === CameraMode.Perspective;

    return (
        <>
            {(props.cameraMode === CameraMode.Orthographic) &&
                <OrthographicCamera
                    makeDefault
                    args={[canvasWidth / -2, canvasWidth / 2, canvasHeight / 2, canvasHeight / -2, 0, 1000]} />
            }
            {(props.cameraMode === CameraMode.Perspective) &&
                <PerspectiveCamera
                    makeDefault
                    position={[0, 0, 1]}
                    args={[vFov(), aspect(), .1, 2000]}
                    ref={perspectiveCameraRef}
                />
            }
            <OrbitControls
                enablePan={enableOrbitControls}
                enableZoom={enableOrbitControls}
                enableRotate={enableOrbitControls} />
            <mesh ref={myMesh}>
                <planeGeometry attach='geometry' args={props.cameraMode === CameraMode.Orthographic ?
                    [canvasWidth, canvasHeight, 1, 1] :
                    [perspectivePlaneWidth(), perspectivePlaneHeight(), 1, 1]} />
                <weaveDisplayMaterial attach='material' patternDataTexture={patternDataTexture} repeats={props.repeats} />
            </mesh>
        </>
    )
}

export default Scene;
