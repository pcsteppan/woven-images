// /// <reference types="react" />
// import { Effect } from 'postprocessing'
// import React, { forwardRef, useMemo } from 'react'
// import { Uniform } from 'three'

// const fragmentShader = `some_shader_code`

// let _uParam;

// // Effect implementation
// class MyCustomEffectImpl extends Effect {
//   constructor({ param = 0.1 } = {}) {
//     super('MyCustomEffect', fragmentShader, {
//       uniforms: new Map([['param', new Uniform(param)]]),
//     })

//     _uParam = param
//   }

//   update(renderer, inputBuffer, deltaTime) {
//     this.uniforms.get('param').value = _uParam
//   }
// }

// // Effect component
// export const MyCustomEffect = forwardRef(({ param }, ref) => {
//   const effect = useMemo(() => new MyCustomEffectImpl(param), [param])
//   return <primitive ref={ref} object={effect} dispose={null} />
// })

// /// <reference types="react" />
// import { VignetteEffect } from 'postprocessing';
// export declare const Vignette: import("react").ForwardRefExoticComponent<{
//     blendFunction?: import("postprocessing").BlendFunction;
//     eskil?: boolean;
//     offset?: number;
//     darkness?: number;
// } & Partial<{
//     blendFunction: import("postprocessing").BlendFunction;
//     opacity: number;
// }> & import("react").RefAttributes<typeof VignetteEffect>>;