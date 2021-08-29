import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'
import { CameraUtils } from 'three/examples/jsm/utils/CameraUtils.js';
import * as dat from 'dat.gui'
import { Vector3 } from 'three';

/** 
 * Debug
 */
const gui = new dat.GUI()


/**
 * Constants
 */

const hallwayLength = 10
const hallwayWidth = 3
const hallwayHeight = 2
const doorWidth = 1
const doorHeight = 1.5
const doorsPerSide = 3

/**
 * Textures
 */

var textureLoader = new THREE.TextureLoader()
var matcap = textureLoader.load('/textures/matcaps/8.png')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/** 
 * Objects 
 * */

// Helpers

 const bottomLeftCorner = new THREE.Vector3();
 const bottomRightCorner = new THREE.Vector3();
 const topLeftCorner = new THREE.Vector3();
 const reflectedPosition = new THREE.Vector3();

// Axes Helper

const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)
gui.add(axesHelper, 'visible').name('Axes Helper')

//#region Hallway

const hallway = new THREE.Group()
const hallwayMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcap
})

const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(hallwayLength, hallwayHeight),
    hallwayMaterial
)
leftWall.rotation.y = Math.PI * 0.5
leftWall.position.x = -(hallwayWidth*0.5)
leftWall.position.y = hallwayHeight*0.5
hallway.add(leftWall)

const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(hallwayLength, hallwayHeight),
    hallwayMaterial
)
rightWall.rotation.y = Math.PI * 1.5
rightWall.position.x = hallwayWidth*0.5
rightWall.position.y = hallwayHeight*0.5
hallway.add(rightWall)

const roof = new THREE.Mesh(
    new THREE.PlaneGeometry(hallwayLength, hallwayWidth),
    hallwayMaterial
)
roof.rotation.x = Math.PI * 0.5
roof.rotation.z = Math.PI * 0.5
roof.position.y = hallwayHeight
hallway.add(roof)

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(hallwayLength, hallwayWidth),
    hallwayMaterial
)
floor.rotation.x = Math.PI * 1.5
floor.rotation.z = Math.PI * 0.5
hallway.add(floor)

const entryWall = new THREE.Mesh(
    new THREE.PlaneGeometry(hallwayHeight, hallwayWidth),
    hallwayMaterial
)
entryWall.rotation.z = Math.PI * 0.5
entryWall.rotation.x = Math.PI
entryWall.position.y = hallwayHeight*0.5
entryWall.position.z = hallwayLength*0.5
hallway.add(entryWall)

const farWall = new THREE.Mesh(
    new THREE.PlaneGeometry(hallwayHeight, hallwayWidth),
    hallwayMaterial
)
farWall.rotation.z = Math.PI * 0.5
farWall.position.y = hallwayHeight*0.5
farWall.position.z = -(hallwayLength*0.5)
hallway.add(farWall)

const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({
        color: "#64e0aa"
    })
)
box.position.z = -(hallwayLength*0.25)
box.position.y = 0.5
hallway.add(box)

scene.add(hallway)

//#endregion Hallway

//#region  Doors

const doorGeometry = new THREE.PlaneGeometry(doorWidth, doorHeight)
const doorGroup = new THREE.Group()
const textureGroup = []

// Entry Door
const entryDoorTexture = new THREE.WebGLRenderTarget(1024, 1024, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat,
    depthBuffer: false,
    stencilBuffer: false
})

const entryDoor = new THREE.Mesh(
    doorGeometry,
    new THREE.MeshBasicMaterial({
        map: entryDoorTexture.texture
    })
)
entryDoor.scale.set(1, 1, 1)
entryDoor.position.y = doorHeight*0.5
entryDoor.position.z = (hallwayLength*0.5)-0.001
entryDoor.rotation.y = Math.PI
scene.add(entryDoor)

const chunk = hallwayLength/(doorsPerSide+1)

for (var x = (-hallwayWidth*0.5); x <= hallwayWidth*0.5; x+=hallwayWidth ) {
    for (var z = -(hallwayLength/2)+chunk; z < hallwayLength/2; z+=chunk) {
        let doorTexture = new THREE.WebGLRenderTarget(1024, 1024, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBFormat
        })
    
        let door = new THREE.Mesh(
            doorGeometry,
            new THREE.MeshBasicMaterial({
                map: doorTexture.texture
            })
        )
        
        var setX = x > 0 ? x-0.001 : x+0.001
        door.scale.set(0.8, 0.8, 0.8)
        door.position.set(setX, (doorHeight*0.5) - 0.15, z)
        door.rotation.y = x > 0 ? -Math.PI * 0.5 : Math.PI * 0.5
        doorGroup.add(door)
        textureGroup.push(doorTexture)
    }
    scene.add(doorGroup)
}

//#endregion Doors

//#region Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 0
pointLight.position.y = 2
pointLight.position.z = -0
scene.add(pointLight)

//#endregion Lights

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.y = hallwayHeight*0.5
camera.position.z = hallwayLength*0.25

scene.add(camera)

var direction = new THREE.Vector3(); // create once and reuse it!

camera.getWorldDirection( direction );

//Base camera controls
document.addEventListener('keydown', (e) => {
    console.log(e.code)
    if (e.code == 'KeyW' || e.code == 'ArrowUp') {
        camera.position.set(
            camera.position.x + direction.x, 
            camera.position.y + direction.y, 
            camera.position.z + direction.z, )
        camera.getWorldDirection( direction );
    }
    if (e.code == 'KeyA' || e.code == 'ArrowLeft') {
        camera.rotation.y += Math.PI*0.25
        camera.getWorldDirection( direction );
    }
    if (e.code == 'KeyD' || e.code == 'ArrowRight') {
        camera.rotation.y -= Math.PI*0.25
        camera.getWorldDirection( direction );
    }
    if (e.code == 'KeyS' || e.code == 'ArrowDown') {
        camera.position.set(
            camera.position.x - direction.x, 
            camera.position.y - direction.y, 
            camera.position.z - direction.z, )
        camera.getWorldDirection( direction );
    }
    if (e.code == 'KeyQ') {
        console.log(direction)
        console.log(camera.rotation)
        console.log(camera.position)
    }
})


// Portal Camera
const portalCamera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)

const portalCameraHelper = new THREE.CameraHelper(portalCamera)

scene.add(portalCamera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor("#4a4e69")

// const controls = new FirstPersonControls( camera, renderer.domElement );
// controls.movementSpeed = 0.005;
// controls.lookSpeed = 0.001;
// controls.lookAt(new Vector3(0, 1, 0))

// document.addEventListener('keypress', (e) => {
//     if (e.code == 'KeyQ') {
//         controls.movementSpeed = 0
//         controls.lookSpeed = 0
//     } else {
//         controls.movementSpeed = 0.05;
//         controls.lookSpeed = 0.002;
//     }
// })

/**
 * Render Portals
*/

function renderPortal( thisPortalMesh, otherPortalMesh, thisPortalTexture ) {
    // set the portal camera position to be reflected about the portal plane
    thisPortalMesh.worldToLocal( reflectedPosition.copy( camera.position ) );
    reflectedPosition.x *= - 1.0; reflectedPosition.z *= - 1.0;
    otherPortalMesh.localToWorld( reflectedPosition );
    portalCamera.position.copy( reflectedPosition );

    // grab the corners of the other portal
    // - note: the portal is viewed backwards; flip the left/right coordinates
    otherPortalMesh.localToWorld( bottomLeftCorner.set( doorWidth*0.5, -(doorHeight*0.5), 0.0 ) );
    otherPortalMesh.localToWorld( bottomRightCorner.set( - (doorWidth*0.5), -(doorHeight*0.5), 0.0 ) );
    otherPortalMesh.localToWorld( topLeftCorner.set( doorWidth*0.5, doorHeight*0.5, 0.0 ) );
    // set the projection matrix to encompass the portal's frame
    CameraUtils.frameCorners( portalCamera, bottomLeftCorner, bottomRightCorner, topLeftCorner, false );

    // render the portal
    thisPortalTexture.texture.encoding = renderer.outputEncoding
    renderer.setRenderTarget( thisPortalTexture );
    renderer.state.buffers.depth.setMask( true ); // make sure the depth buffer is writable so it can be properly cleared, see #18897
    if ( renderer.autoClear === false ) renderer.clear();
    thisPortalMesh.visible = false;
    renderer.render( scene, portalCamera );
    thisPortalMesh.visible = true;
}

// var sampleTexture = new THREE.WebGLRenderTarget(1024, 1024, {
//     minFilter: THREE.NearestFilter,
//     magFilter: THREE.LinearFilter,
//     format: THREE.RGBFormat
// })

// renderPortal(entryDoor, entryDoor, sampleTexture)
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    
    // Update controls
    //controls.update(1)
    // if (camera.position.x >= 1.3 || 
    //     camera.position.x <= -1.3 || 
    //     camera.position.z >= 3.8) {
    //     let x = camera.position.x
    //     let y = camera.position.y
    //     let rotx = camera.rotation.x
    //     console.log("x rotation pre: " + rotx)
    //     let roty = camera.rotation.y
    //     let rotz = camera.rotation.z
    //     camera.position.set(0, camera.position.y, 3.79)
    //     camera.rotation.z = rotz+(Math.PI*0.5)
    //     //controls.lookAt(new Vector3(-x, y, -3.5))
    //     console.log("x rotation post: " + camera.rotation.x)
    // }

    // save the original camera properties
    const currentRenderTarget = renderer.getRenderTarget();
    const currentXrEnabled = renderer.xr.enabled;
    const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;
    renderer.xr.enabled = false; // Avoid camera modification
    renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

    // render the portal effect

    // for (var i = 0; i < doorsPerSide*2; i++) {

    //     for (var j = 0; j < doorsPerSide*2; j++) {
    //         //newTextures.push(textureGroup[i])

    //         //renderPortal(doorGroup.children[j], entryDoor, textureGroup[j])
            
    //         // entryDoor.localToWorld( bottomLeftCorner.set( doorWidth*0.5, -(doorHeight*0.5), 0.0 ) );
    //         // entryDoor.localToWorld( bottomRightCorner.set( - (doorWidth*0.5), -(doorHeight*0.5), 0.0 ) );
    //         // entryDoor.localToWorld( topLeftCorner.set( doorWidth*0.5, doorHeight*0.5, 0.0 ) );
    //         // CameraUtils.frameCorners( portalCamera, bottomLeftCorner, bottomRightCorner, topLeftCorner, false );

    //         // textureGroup[j].texture.encoding = renderer.outputEncoding
    //         // renderer.setRenderTarget( textureGroup[j] );
    //         // renderer.state.buffers.depth.setMask( true ); // make sure the depth buffer is writable so it can be properly cleared, see #18897
    //         // if ( renderer.autoClear === false ) renderer.clear();
    //         // doorGroup.children[j].visible = false;
    //         // renderer.render( scene, portalCamera );
    //         // doorGroup.children[j].visible = true;
    //     }
    //     newTextures.push(textureGroup[i])
    // }

    // for (var k = 0; k < doorsPerSide*2; k++) {
    //     //console.log(doorGroup.children[k].material.map)
    //     textureGroup[k] = newTextures[k]
    //     textureGroup[k].texture.encoding = renderer.outputEncoding
    //     renderer.setRenderTarget( textureGroup[k] );
    //     renderer.state.buffers.depth.setMask( true ); // make sure the depth buffer is writable so it can be properly cleared, see #18897
    //     if ( renderer.autoClear === false ) renderer.clear();
    //     doorGroup.children[k].visible = false;
    //     renderer.render( scene, portalCamera );
    //     doorGroup.children[k].visible = true;
    // }

    var newTextures = []

    for (var j = 0; j < doorsPerSide*2; j++) {
        // for(var i = 0; i < doorsPerSide*2; i++) {
        //     doorGroup.children[i].map = sampleTexture.texture
        // }
        renderPortal(doorGroup.children[j], entryDoor, textureGroup[j])
    }
    
    renderPortal( entryDoor, doorGroup.children[2], entryDoorTexture)

    // restore the original rendering properties
    renderer.xr.enabled = currentXrEnabled;
    renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;
    renderer.setRenderTarget( currentRenderTarget );


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()