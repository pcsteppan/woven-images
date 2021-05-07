import { OrbitControls, OrthographicCamera, shaderMaterial } from '@react-three/drei';
import { DepthOfField, DotScreen, EffectComposer, Noise } from '@react-three/postprocessing';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Mesh } from 'three';
import { rFromHexString, bFromHexString, gFromHexString } from '../../utils';
import "./WeaveDisplayMaterial";

const createPatternDataTexture = (width: number, height: number, buffer: string[]) => {
    const size = width * height;
    const patternData = new Uint8Array( 3 * size );

    for(let i = 0; i < size; i++) {
        const stride = i*3;

        const r = rFromHexString(buffer[i]);
        const g = gFromHexString(buffer[i]);
        const b = bFromHexString(buffer[i]);

        patternData[stride    ] = r;
        patternData[stride + 1] = b;
        patternData[stride + 2] = g;
    }

    const patternTexture = new THREE.DataTexture(patternData, width, height, THREE.RGBFormat);
    return patternTexture;
}

interface SceneProps {
    warpThreadCount: number,
    weftThreadCount: number,
    unitSize: number,
    repeats: number,
    colorBuffer: string[]
}

const initialPatternDataTexture = createPatternDataTexture(2,2,["#ffffff", "#000000", "#ffffff", "#000000"]);

function Scene(props: SceneProps) {
    const myMesh = useRef<Mesh>();
    const [patternDataTexture, setPatternDataTexture] = useState(initialPatternDataTexture);
    
    // useFrame(({clock}) => {
    //     if(myMesh.current) {
    //         myMesh.current.rotation.x = clock.getElapsedTime();
    //         myMesh.current.rotation.y = clock.getElapsedTime();
    //     }
    // })

    useEffect(() => {
        setPatternDataTexture(createPatternDataTexture(props.warpThreadCount, props.weftThreadCount, props.colorBuffer));
        patternDataTexture.needsUpdate = true;
    }, [props])

    // const maxNumThreadTypes = 2;
    // const paletteTextureWidth = maxNumThreadTypes;
    // const paletteTextureHeight = 1;
    // const palette = new Uint8Array(paletteTextureWidth * 3);
    // const paletteTexture = new THREE.DataTexture(
    //     palette, paletteTextureWidth, paletteTextureHeight, THREE.RGBFormat);

    // paletteTexture.minFilter = THREE.NearestFilter;
    // paletteTexture.magFilter = THREE.NearestFilter;

    // palette.set([255,0,0], 0);
    // palette.set([0,0,255], 1);

    // paletteTexture.needsUpdate = true;
    
    const canvasWidth = props.warpThreadCount * props.unitSize;
    const canvasHeight = props.weftThreadCount * props.unitSize;

    return (
        <>
            
                {/* <Suspense fallback={null}> */}
            <OrthographicCamera
                makeDefault
                args={[canvasWidth / -2, canvasWidth / 2, canvasHeight / 2, canvasHeight / -2, 0, 1000]} />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                    <EffectComposer>
                        <DotScreen
                            angle={Math.PI * 0.5} // angle of the dot pattern
                            scale={1.0} // scale of the dot pattern
                        />
                    </EffectComposer>
                    <mesh ref={myMesh}>
                        {/* <DepthOfField /> */}
                        <planeGeometry attach='geometry' args={[canvasWidth,canvasHeight,1,1]} />
                        <weaveDisplayMaterial attach='material' patternDataTexture={patternDataTexture} repeats={props.repeats}/>
                        {/* <meshBasicMaterial map={patternDataTexture} side={THREE.DoubleSide}/> */}
                    </mesh>
                {/* </Suspense> */}
        </>
    )
}

export default Scene;
