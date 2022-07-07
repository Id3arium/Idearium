import React , {useRef} from 'react'
import forceGraph3d from '3d-force-graph';

export default function ForceGraph3D() {
    let ref = useRef();
    return (
        <div className="force-graph-3d">
            <sgv ref={ref}></sgv>
        </div>
    )
}