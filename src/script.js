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
 * Textures
 */

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

// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

//#region Hallway

const hallway = new THREE.Group()
const hallwayMaterial = new THREE.MeshStandardMaterial({
    color: "#ffe388"
})

const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 2),
    hallwayMaterial
)
leftWall.rotation.y = Math.PI * 0.5
leftWall.position.x = -5.5

hallway.add(leftWall)

const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 2),
    hallwayMaterial
)
rightWall.position.x = -2.5
rightWall.rotation.y = Math.PI * 1.5
hallway.add(rightWall)

const roof = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 3),
    hallwayMaterial
)
roof.position.z = 0
roof.position.y = 1
roof.position.x = -4
roof.rotation.x = Math.PI * 0.5
roof.rotation.z = Math.PI * 0.5
hallway.add(roof)

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 3),
    hallwayMaterial
)
floor.position.z = 0
floor.position.y = -1
floor.position.x = -4
floor.rotation.x = Math.PI * 1.5
floor.rotation.z = Math.PI * 0.5
hallway.add(floor)

const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 3),
    hallwayMaterial
)
backWall.rotation.z = Math.PI * 0.5
backWall.rotation.x = Math.PI
backWall.position.x = -4
backWall.position.z = 4
hallway.add(backWall)

const frontWall = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 3),
    hallwayMaterial
)
frontWall.rotation.z = Math.PI * 0.5
frontWall.position.x = -4
frontWall.position.z = -4
hallway.add(frontWall)

const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({
        color: "#64e0aa"
    })
)
box.position.x = -4
box.position.z = -2.5
box.position.y = - 0.5
hallway.add(box)

hallway.position.set(4, 1, 0)

scene.add(hallway)

//#endregion Hallway

//#region  Doors

const doorGeometry = new THREE.PlaneGeometry(1, 1.5)

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
entryDoor.position.y = 0.75
entryDoor.position.z = 3.995
entryDoor.rotation.y = Math.PI
scene.add(entryDoor)

// Door 1
const door1Texture = new THREE.WebGLRenderTarget(1024, 1024, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat
})

const door1 = new THREE.Mesh(
    doorGeometry,
    new THREE.MeshBasicMaterial({
        map: door1Texture.texture
    })
)
door1.position.set(-1.499, 0.75, 3)
door1.rotation.y = Math.PI * 0.5
scene.add(door1)

// Door 2
const door2Texture = new THREE.WebGLRenderTarget(1024, 1024, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat
})

const door2 = new THREE.Mesh(
    doorGeometry,
    new THREE.MeshBasicMaterial({
        map: door2Texture.texture
    })
)
door2.position.set(1.499, 0.75, 3)
door2.rotation.y = -Math.PI * 0.5
scene.add(door2)

// Door 3
const door3Texture = new THREE.WebGLRenderTarget(1024, 1024, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat
})

const door3 = new THREE.Mesh(
    doorGeometry,
    new THREE.MeshBasicMaterial({
        map: door3Texture.texture
    })
)
door3.position.set(-1.499, 0.75, 1.0)
door3.rotation.y = Math.PI * 0.5
scene.add(door3)

// Door 4
const door4Texture = new THREE.WebGLRenderTarget(1024, 1024, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat
})

const door4 = new THREE.Mesh(
    doorGeometry,
    new THREE.MeshBasicMaterial({
        map: door4Texture.texture
    })
)
door4.position.set(1.499, 0.75, 1.0)
door4.rotation.y = -Math.PI * 0.5
scene.add(door4)

// Door 5
const door5Texture = new THREE.WebGLRenderTarget(1024, 1024, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat
})

const door5 = new THREE.Mesh(
    doorGeometry,
    new THREE.MeshBasicMaterial({
        map: door5Texture.texture
    })
)
door5.position.set(1.499, 0.75, -1.0)
door5.rotation.y = -Math.PI * 0.5
scene.add(door5)

// Door 6
const door6Texture = new THREE.WebGLRenderTarget(1024, 1024, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat
})

const door6 = new THREE.Mesh(
    doorGeometry,
    new THREE.MeshBasicMaterial({
        map: door6Texture.texture
    })
)
door6.position.set(-1.499, 0.75, -1.0)
door6.rotation.y = Math.PI * 0.5
scene.add(door6)

// Door 7
const door7Texture = new THREE.WebGLRenderTarget(1024, 1024, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat
})

const door7 = new THREE.Mesh(
    doorGeometry,
    new THREE.MeshBasicMaterial({
        map: door7Texture.texture
    })
)
door7.position.set(1.499, 0.75, -3)
door7.rotation.y = -Math.PI * 0.5
scene.add(door7)

// Door 8
const door8Texture = new THREE.WebGLRenderTarget(1024, 1024, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat
})

const door8 = new THREE.Mesh(
    doorGeometry,
    new THREE.MeshBasicMaterial({
        map: door8Texture.texture
    })
)
door8.position.set(-1.499, 0.75, -3)
door8.rotation.y = Math.PI * 0.5
scene.add(door8)

//#endregion Doors

//#region Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 0
pointLight.position.y = 0
pointLight.position.z = 0
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
camera.position.x = 0
camera.position.y = 1
camera.position.z = 3.5

scene.add(camera)

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
renderer.setClearColor("#00ffff")

const controls = new FirstPersonControls( camera, renderer.domElement );
controls.movementSpeed = 0.05;
controls.lookSpeed = 0.002;
controls.lookAt(new Vector3(0, 1, 0))

document.addEventListener('keypress', (e) => {
    if (e.code == 'KeyQ') {
        controls.movementSpeed = 0
        controls.lookSpeed = 0
    } else {
        controls.movementSpeed = 0.05;
        controls.lookSpeed = 0.002;
    }
})

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
    otherPortalMesh.localToWorld( bottomLeftCorner.set( 0.5, - 0.75, 0.0 ) );
    otherPortalMesh.localToWorld( bottomRightCorner.set( - 0.5, - 0.75, 0.0 ) );
    otherPortalMesh.localToWorld( topLeftCorner.set( 0.5, 0.75, 0.0 ) );
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    

    // Update controls
    controls.update(1)
    if (camera.position.x >= 1.3 || 
        camera.position.x <= -1.3 || 
        camera.position.z >= 3.8) {
        let x = camera.position.x
        let y = camera.position.y
        let rotx = camera.rotation.x
        console.log("x rotation pre: " + rotx)
        let roty = camera.rotation.y
        let rotz = camera.rotation.z
        camera.position.set(0, camera.position.y, 3.79)
        camera.rotation.z = rotz+(Math.PI*0.5)
        //controls.lookAt(new Vector3(-x, y, -3.5))
        console.log("x rotation post: " + camera.rotation.x)
    }

    // save the original camera properties
    const currentRenderTarget = renderer.getRenderTarget();
    const currentXrEnabled = renderer.xr.enabled;
    const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;
    renderer.xr.enabled = false; // Avoid camera modification
    renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

    // render the portal effect
    renderPortal( door1, entryDoor, door1Texture );
    renderPortal( door2, entryDoor, door2Texture );
    renderPortal( door3, entryDoor, door3Texture );
    renderPortal( door4, entryDoor, door4Texture );
    renderPortal( door5, entryDoor, door5Texture );
    renderPortal( door6, entryDoor, door6Texture );
    renderPortal( door7, entryDoor, door7Texture );
    renderPortal( door8, entryDoor, door8Texture );
    renderPortal( entryDoor, entryDoor, entryDoorTexture)

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