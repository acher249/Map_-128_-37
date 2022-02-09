import { createChannel } from '../node_modules/decentraland-builder-scripts/channel'
import { createInventory } from '../node_modules/decentraland-builder-scripts/inventory'
import Script1 from "../c5cbd030-54d0-4f28-9158-d27401c691b1/src/item"
import Script2 from "../b88efbbf-2a9a-47b4-86e1-e38ecc2b433b/src/item"
import Script3 from "../0ee46c79-338c-445a-a506-ea26d80fbe46/src/item"
import Script4 from "../a747f104-5434-42a8-a543-8739c24cf253/src/item"
import Script5 from "../7d669c08-c354-45e4-b3a3-c915c8fd6b6e/src/item"

class RotatorSystem {
  // this group will contain every entity that has a Transform component
  group = engine.getComponentGroup(Transform)

  // ajc spin bool
  spinBool = true

  update(dt: number) {
    // iterate over the entities of the group
    for (let entity of this.group.entities) {
      // get the Transform component of the entity
      const transform = entity.getComponent(Transform)

      // mutate the rotation
      // transform.rotate(Vector3.Up(), dt * 10)
    }

  }
}

//
class ElevatorSystem {

  elevatorCube = new Entity()

  //elevator stop bool
  elevatorStop = true

  // ajc go up bool
  goUp = false

  update(dt: number) {

    // if the elevator is not stopped move it
    if(this.elevatorStop == false){

      if(this.goUp){
        log("elevator going up..")
        // go up

        this.elevatorCube.getComponent(Transform).position = new Vector3(this.elevatorCube.getComponent(Transform).position.x, 
        this.elevatorCube.getComponent(Transform).position.y + .02, 
        this.elevatorCube.getComponent(Transform).position.z) 
  
      }else{
        log("elevator going down..")
        // go down

        this.elevatorCube.getComponent(Transform).position = new Vector3(this.elevatorCube.getComponent(Transform).position.x, 
        this.elevatorCube.getComponent(Transform).position.y - .02, 
        this.elevatorCube.getComponent(Transform).position.z) 
  
      }
      log("Elevator is moving")
    }else{

      // no movement
      log("Elevator is stopped")

    }


  }
}

// now do things with face

// Add a new instance of the system to the engine
let rotSystem = new RotatorSystem()
engine.addSystem(rotSystem)

let elevatorSystem = new ElevatorSystem()
engine.addSystem(elevatorSystem)

/// --- Spawner function ---

function spawnCube(x: number, y: number, z: number) {
  // create the entity
  const cube = new Entity()

  // add a transform to the entity
  cube.addComponent(new Transform({ position: new Vector3(x, y, z) }))

  // add a shape to the entity
  cube.addComponent(new BoxShape())

  // add the entity to the engine
  engine.addEntity(cube)

  return cube
}

/// --- Spawn a cube ---
const ElevatorRootEntity = new Entity()
ElevatorRootEntity.addComponent(new Transform({ position: new Vector3(8,0,8) })) // center
engine.addEntity(ElevatorRootEntity)

const SceneRootEntity = new Entity()
SceneRootEntity.addComponent(new Transform({ position: new Vector3(8,0,8) })) // center
engine.addEntity(SceneRootEntity)

export class SimpleRotate implements ISystem {
  update() {
    let transform = faceEntity.getComponent(Transform)
    transform.rotate(Vector3.Up(), 3)
  }
}

engine.addSystem(new SimpleRotate())

// const pav = new Entity();
// pav.addComponent(new GLTFShape("models/Pav_23.glb"));
// pav.addComponent(new Transform({ position: new Vector3(0,0,0), scale: new Vector3(1,1,1) }));
// pav.setParent(SceneRootEntity);

//
const faceEntity = new Entity();
faceEntity.addComponent(new GLTFShape("models/face4.glb"));
faceEntity.addComponent(new Transform());
faceEntity.setParent(SceneRootEntity);

// ----------------

const cube = spawnCube(0, .5, 0)
cube.getComponent(Transform).scale = new Vector3(3,.1,3)
// tie this cube into the elevator system
elevatorSystem.elevatorCube = ElevatorRootEntity

// ------ Create Buttons -------- //
const ElevtorUpDownButton = spawnCube(1, .5, 3)
const ElevtorStopButton = spawnCube(2, .5, 3)

// make everything in Elevator child to rootEntity, then move root entity, so that parent tranforms dont effect children
cube.setParent(ElevatorRootEntity)
ElevtorUpDownButton.setParent(ElevatorRootEntity)
ElevtorStopButton.setParent(ElevatorRootEntity)

ElevtorUpDownButton.getComponent(Transform).scale = new Vector3(.4,.4,.4)
ElevtorStopButton.getComponent(Transform).scale = new Vector3(.4,.4,.4)

//Create material and configure its fields
const RedMaterial = new Material()
RedMaterial.albedoColor = Color3.Red()
RedMaterial.metallic = 0.9
RedMaterial.roughness = 0.1

const GreenMaterial = new Material()
GreenMaterial.albedoColor = Color3.Green()
GreenMaterial.metallic = 0.9
GreenMaterial.roughness = 0.1

//Assign the material to the entity
ElevtorStopButton.addComponent(RedMaterial)
ElevtorUpDownButton.addComponent(GreenMaterial)

// tell elevator which way to go
ElevtorUpDownButton.addComponent(
  new OnClick(() => {

    // if we click to move the elevator up or down, it should no longer be stopped
    elevatorSystem.elevatorStop = false

    // now switch it
    if (elevatorSystem.goUp){
      elevatorSystem.goUp = false
    }else{
      elevatorSystem.goUp = true
    }

  })
)

/// tell elevator to stop or not
ElevtorStopButton.addComponent(
  new OnClick(() => {

    if (elevatorSystem.elevatorStop){
      elevatorSystem.elevatorStop = false
    }else{
      elevatorSystem.elevatorStop = true
    }

  })
)

const _scene = new Entity('_scene')
engine.addEntity(_scene)
const transform = new Transform({
  position: new Vector3(0, 0, 0),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
_scene.addComponentOrReplace(transform)

const ambientSound = new Entity('ambientSound')
engine.addEntity(ambientSound)
ambientSound.setParent(_scene)
const transform2 = new Transform({
  position: new Vector3(9, 4.827388286590576, 7.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
ambientSound.addComponentOrReplace(transform2)

const externalLink = new Entity('externalLink')
engine.addEntity(externalLink)
externalLink.setParent(_scene)
const transform3 = new Transform({
  position: new Vector3(15.238581657409668, 1.4088020324707031, 4.821623802185059),
  rotation: new Quaternion(-3.0652731109517264e-15, -0.7204346656799316, 8.588250466345926e-8, 0.6935228705406189),
  scale: new Vector3(1.0000042915344238, 1, 1.0000042915344238)
})
externalLink.addComponentOrReplace(transform3)

const teleport = new Entity('teleport')
engine.addEntity(teleport)
teleport.setParent(_scene)
const transform4 = new Transform({
  position: new Vector3(10.513654708862305, 0.004504680633544922, 13.785896301269531),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
teleport.addComponentOrReplace(transform4)

const ostrichFerns5 = new Entity('ostrichFerns5')
engine.addEntity(ostrichFerns5)
ostrichFerns5.setParent(_scene)
const gltfShape = new GLTFShape("af9213a3-3310-4564-9633-dd56815c85fa/Grass_02/Grass_02.glb")
gltfShape.withCollisions = true
gltfShape.isPointerBlocker = true
gltfShape.visible = true
ostrichFerns5.addComponentOrReplace(gltfShape)
const transform5 = new Transform({
  position: new Vector3(14.368366241455078, 0.32192128896713257, 13.9795560836792),
  rotation: new Quaternion(2.7887666168588485e-15, -0.8196080923080444, 9.77048841832584e-8, -0.5729247331619263),
  scale: new Vector3(2.969888210296631, 4.480645656585693, 3.9221267700195312)
})
ostrichFerns5.addComponentOrReplace(transform5)

const videoStream = new Entity('videoStream')
engine.addEntity(videoStream)
videoStream.setParent(_scene)
const transform6 = new Transform({
  position: new Vector3(7.902976989746094, 0.5416079759597778, 0.5693988800048828),
  rotation: new Quaternion(-1.5299661358788783e-14, -1, 1.1920928244535389e-7, -0.0003583701327443123),
  scale: new Vector3(1.8256645202636719, 1.825653314590454, 1.8256645202636719)
})
videoStream.addComponentOrReplace(transform6)

const externalLink2 = new Entity('externalLink2')
engine.addEntity(externalLink2)
externalLink2.setParent(_scene)
const transform7 = new Transform({
  position: new Vector3(15.199782371520996, 1.4088021516799927, 5.840534210205078),
  rotation: new Quaternion(-3.0652731109517264e-15, -0.7204346656799316, 8.588250466345926e-8, 0.6935228705406189),
  scale: new Vector3(1.000004768371582, 1, 1.000004768371582)
})
externalLink2.addComponentOrReplace(transform7)

const lightYellowSycamoreTree = new Entity('lightYellowSycamoreTree')
engine.addEntity(lightYellowSycamoreTree)
lightYellowSycamoreTree.setParent(_scene)
const transform8 = new Transform({
  position: new Vector3(2, 0.30475425720214844, 2.074122428894043),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
lightYellowSycamoreTree.addComponentOrReplace(transform8)
const gltfShape2 = new GLTFShape("6dd971fe-6284-4c74-8327-c87f0d692b32/TreeSycamore_02/TreeSycamore_02.glb")
gltfShape2.withCollisions = true
gltfShape2.isPointerBlocker = true
gltfShape2.visible = true
lightYellowSycamoreTree.addComponentOrReplace(gltfShape2)

const imageFromURL = new Entity('imageFromURL')
engine.addEntity(imageFromURL)
imageFromURL.setParent(_scene)
const transform9 = new Transform({
  position: new Vector3(13.634611129760742, 1.2897051572799683, 2.155001640319824),
  rotation: new Quaternion(-4.5464562927046025e-17, 0.9124054908752441, -1.0876720324404232e-7, 0.40928763151168823),
  scale: new Vector3(4.2585344314575195, 1.1769804954528809, 2.62664794921875)
})
imageFromURL.addComponentOrReplace(transform9)

const entity = new Entity('entity')
engine.addEntity(entity)
entity.setParent(_scene)
const gltfShape3 = new GLTFShape("6b33f46e-9667-45e5-bd90-85f372ee2490/CityTile.glb")
gltfShape3.withCollisions = true
gltfShape3.isPointerBlocker = true
gltfShape3.visible = true
entity.addComponentOrReplace(gltfShape3)
const transform10 = new Transform({
  position: new Vector3(8, 0, 8),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
entity.addComponentOrReplace(transform10)

const fourSquareFloorPanel = new Entity('fourSquareFloorPanel')
engine.addEntity(fourSquareFloorPanel)
fourSquareFloorPanel.setParent(_scene)
const transform11 = new Transform({
  position: new Vector3(16, 0, 15.945978164672852),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(7.919536590576172, 7.919536590576172, 7.919536590576172)
})
fourSquareFloorPanel.addComponentOrReplace(transform11)
const gltfShape4 = new GLTFShape("06f65cfc-1013-4506-930f-ff759561185d/FloorSciFiPanel_02/FloorSciFiPanel_02.glb")
gltfShape4.withCollisions = true
gltfShape4.isPointerBlocker = true
gltfShape4.visible = true
fourSquareFloorPanel.addComponentOrReplace(gltfShape4)

const channelId = Math.random().toString(16).slice(2)
const channelBus = new MessageBus()
const inventory = createInventory(UICanvas, UIContainerStack, UIImage)
const options = { inventory }

const script1 = new Script1()
const script2 = new Script2()
const script3 = new Script3()
const script4 = new Script4()
const script5 = new Script5()
script1.init(options)
script2.init(options)
script3.init(options)
script4.init(options)
script5.init(options)
script1.spawn(ambientSound, {"sound":"Birds","active":true,"loop":true}, createChannel(channelId, ambientSound, channelBus))
script2.spawn(externalLink, {"url":"www.chernickdesign.com","name":"www.chernickdesign.com"}, createChannel(channelId, externalLink, channelBus))
script3.spawn(teleport, {"x":"20","y":"-141"}, createChannel(channelId, teleport, channelBus))
script4.spawn(videoStream, {"startOn":"false","onClickText":"Play video","volume":1,"onClick":[{"entityName":"videoStream","actionId":"toggle","values":{}}],"station":"https://theuniverse.club/live/consensys/index.m3u8","customStation":"https://ipfs.io/ipfs/QmZu8nYwx1XrseH7x58C3A7KHhpCa1o3zHfRe1KqTdtV9i?filename=Simulation_2_trimmed.mp4","onDeactivate":[]}, createChannel(channelId, videoStream, channelBus))
script2.spawn(externalLink2, {"url":"https://www.linkedin.com/in/adamchernick/","name":"Connect on LinkedIn"}, createChannel(channelId, externalLink2, channelBus))
script5.spawn(imageFromURL, {"image":"../images/bio.png"}, createChannel(channelId, imageFromURL, channelBus))