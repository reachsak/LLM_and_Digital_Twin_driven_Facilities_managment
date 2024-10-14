const fs = require('fs');
const path = require('path');
const rhino3dm = require('rhino3dm');
const { GLTFExporter } = require('three-stdlib');
const THREE = require('three');

// Function to read 3DM file and convert to GLB
async function convert3dmToGlb(inputFilePath, outputFilePath) {
    // Load Rhino3dm
    const rhino = await rhino3dm();
    console.log('Rhino3dm loaded');

    // Read the 3DM file
    const buffer = fs.readFileSync(inputFilePath);
    const arrayBuffer = new Uint8Array(buffer).buffer;
    const model = rhino.File3dm.fromByteArray(arrayBuffer);

    // Extract objects from the 3DM model
    const objects = model.objects();
    const material = new THREE.MeshStandardMaterial({ color: 0x0055ff });

    // Create a Three.js scene
    const scene = new THREE.Scene();
    for (let i = 0; i < objects.count; i++) {
        const obj = objects.get(i);
        const mesh = rhino.Mesh.createFromBrep(obj.geometry());
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(mesh.vertices(), 3));
        geometry.setIndex(mesh.faces());
        const threeMesh = new THREE.Mesh(geometry, material);
        scene.add(threeMesh);
    }

    // Export the scene to GLB
    const exporter = new GLTFExporter();
    exporter.parse(scene, result => {
        if (result instanceof ArrayBuffer) {
            fs.writeFileSync(outputFilePath, Buffer.from(result));
            console.log(`Converted GLB file saved as ${outputFilePath}`);
        } else {
            console.error('Error during GLB export');
        }
    }, { binary: true });
}

// Define input and output file paths
const inputFilePath = path.resolve('path/to/your/input.3dm');
const outputFilePath = path.resolve('path/to/your/output.glb');

// Convert the 3DM file to GLB
convert3dmToGlb(inputFilePath, outputFilePath);
