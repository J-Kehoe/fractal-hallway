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

//#region Hallway

const hallwayLength = 8
const hallwayWidth = 3
const hallwayHeight = 2

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
box.position.z = -2.5
box.position.y = 0.5
hallway.add(box)

scene.add(hallway)

//#endregion Hallway

//#region  Doors

const doorWidth = 1
const doorHeight = 1.5
const doorGeometry = new THREE.PlaneGeometry(doorWidth, doorHeight)
const doorGroup = new THREE.Group()

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
entryDoor.position.y = doorHeight*0.5
entryDoor.position.z = (hallwayLength*0.5)-0.001
entryDoor.rotation.y = Math.PI
scene.add(entryDoor)

const doorsPerSide = 3
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
        door.position.set(setX, doorHeight*0.5, z)
        door.rotation.y = x > 0 ? -Math.PI * 0.5 : Math.PI * 0.5
        doorGroup.add(door)
    }
    scene.add(doorGroup)
}

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
camera.position.y = hallwayHeight*0.5
camera.position.z = hallwayLength*0.25

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
renderer.setClearColor("#4a4e69")

const controls = new FirstPersonControls( camera, renderer.domElement );
controls.movementSpeed = 0;
controls.lookSpeed = 0;
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
    // renderPortal( door1, entryDoor, door1Texture );
    // renderPortal( door2, entryDoor, door2Texture );
    // renderPortal( door3, entryDoor, door3Texture );
    // renderPortal( door4, entryDoor, door4Texture );
    // renderPortal( door5, entryDoor, door5Texture );
    // renderPortal( door6, entryDoor, door6Texture );
    // renderPortal( door7, entryDoor, door7Texture );
    // renderPortal( door8, entryDoor, door8Texture );
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