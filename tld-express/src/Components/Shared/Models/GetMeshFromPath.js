import React, { Suspense,  useMemo } from 'react'
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Color, MeshBasicMaterial, Mesh } from 'three';

const GetMeshFromPath = (props) => {
    const  CabMesh  = useLoader(OBJLoader, props.modelPath) //this.modelPath)
    const copied = useMemo(() => CabMesh.clone(), [CabMesh])

    if (copied)
    {   
        copied.traverse((child) => {
            if (child instanceof Mesh) {
                child.material = props.material;
                child.material.color = new Color(props.color);
            }
        })
    }
    return (
        <>
            <primitive  dispose={null} object={ copied }/>
        </>
     )
}

export default GetMeshFromPath