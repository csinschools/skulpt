import babylonjsWrapper

babylonObjects = {}

class BabylonObject:
    __counter = 0
    __name = "BObj"
    def __init__(self):   
        self.bObjType = "Object"   
        self.bObjName =  BabylonObject.__name + str(BabylonObject.__counter)
        
        self._animations = []

        babylonObjects[self.bObjName] = self
        BabylonObject.__counter += 1

    @property
    def animations(self):
        return self._animations
    @animations.setter        
    def animations(self, value):
        self._animations = []
        for animation in value:
            self._animations.append(animation.bObjName)        

    def beginAnimation(self, startFrame = 0, endFrame = -1, loop = True):
        babylonjsWrapper.beginAnimation(self.bObjName, startFrame, endFrame, loop)


class Animation(BabylonObject):
    def __init__(self, property = "", frameRate = 10):        
        super().__init__()
        self.property = property
        self.frameRate = frameRate
        self.bObjType = "Animation"      
        self.keys = []

class Texture(BabylonObject):
    def __init__(self, url = ""):        
        super().__init__()
        self.url = url
        self.bObjType = "Texture"   

class DirectionalLight(BabylonObject):
    def __init__(self):        
        super().__init__()
        self.direction = [1, -1, 1]
        self.diffuse = [0.7, 0.7, 0.7]
        self.specular = [1, 1, 1]
        self.bObjType = "DirectionalLight"          

class Skybox(BabylonObject):
    def __init__(self, texture):        
        super().__init__()
        self.size = 1000
        self.texture = texture
        self.bObjType = "Skybox"    

class Mesh(BabylonObject):
    def __init__(self):        
        super().__init__()
        self.position = [0, 0, 0]
        self.orientation = [0, 0, 0]
        self.meshType = None
        self.material = None
        self.bObjType = "Mesh"

class Sphere(Mesh):
    def __init__(self):        
        super().__init__()    
        self.radius = 1
        self.segments = 16
        self.meshType = "sphere"
                
class Material(BabylonObject):
    def __init__(self): 
        super().__init__()   
        self.type = "standard"      
        self.ambientColour = [1, 1, 1]
        self.ambientTexture = None
        self.bObjType = "Material"
        
class Colour:
    black = [0, 0, 0]
    white = [1, 1, 1]
    grey = [0.5, 0.5, 0.5]
    darkGrey  = [0.25, 0.25, 0.25] 
    lightGrey =  [0.75, 0.75, 0.75] 
    red = [1, 0, 0]
    green = [0, 1, 0]
    blue = [0, 0, 1]
    cyan = [0, 1, 1]
    yellow = [1, 1, 0]
    magenta = [1, 0, 1]
    orange = [1, 0.65, 0]
    purple = [0.5, 0, 1]    
    pink = [1, 0.75, 0.8]    
    violet = [0.5, 0, 1]
    indigo = [0.29, 0, 0.51]
    brown = [0.59, 0.29, 0]

def startBabylon():    
    babylonjsWrapper.resetBabylon()

    for bObj in babylonObjects:
        for attribute in babylonObjects[bObj].__dict__:
            if isinstance(babylonObjects[bObj].__dict__[attribute], BabylonObject):
                # resolve references to string names
                name = babylonObjects[bObj].__dict__[attribute].bObjName
                babylonObjects[bObj].__dict__[attribute] = name
        babylonjsWrapper.addObject(babylonObjects[bObj])

    babylonjsWrapper.startBabylon()

    while True:
        pass



