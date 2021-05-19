import React, { forwardRef, useMemo } from 'react'
import { Uniform } from 'three'
import { Effect } from 'postprocessing'

const fragmentShader = `varying vec2 vUv;
void main() {
    gl_FragColor.rgba = vec4(1.,1.,1.,1.);
}`

let _uParam

// Effect implementation
class MyCustomEffectImpl extends Effect {
    // bizarre default object destructuring type of thing
    // what i think is happening is that the constructor expects an object
    // and destructures param from said object
    // and if param does not exist withing said object
    // its default values is 0.1
  constructor({ param = 0.1 } = {}) {
    super('MyCustomEffect', fragmentShader, {
      uniforms: new Map([['param', new Uniform(param)]]),
    })

    _uParam = param
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get('param').value = _uParam
  }
}

// Effect component
const MyCustomEffect = forwardRef(({ param }, ref) => {
  const effect = useMemo(() => new MyCustomEffectImpl(param), [param])
  return <primitive ref={ref} object={effect} dispose={null} />
})

export default { MyCustomEffect };