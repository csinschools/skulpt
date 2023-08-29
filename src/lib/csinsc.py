import csinscTools
import re
from time import sleep
from random import choice

class Colour:
    reset = "\u001b[ 0;2;0;0;0 m"
    red = "\u001b[ 38;2;255;0;0 m"
    black = "\u001b[ 38;2;0;0;0 m"
    white = "\u001b[ 38;2;255;255;255 m"    
    grey = "\u001b[ 38;2;128;128;128 m"
    darkGrey = "\u001b[ 38;2;64;64;64 m"
    lightGrey = "\u001b[ 38;2;192;192;192 m"
    red = "\u001b[ 38;2;255;0;0 m"
    green = "\u001b[ 38;2;0;255;0 m"
    blue = "\u001b[ 38;2;0;0;255 m"
    cyan = "\u001b[ 38;2;0;255;255 m"
    yellow = "\u001b[ 38;2;255;255;0 m"
    magenta = "\u001b[ 38;2;255;0;255 m"
    orange = "\u001b[ 38;2;255;165;0 m"
    purple = "\u001b[ 38;2;127;0;255 m"
    pink = "\u001b[ 38;2;255;192;203 m" 
    violet = "\u001b[ 38;2;128;0;255 m" 
    indigo = "\u001b[ 38;2;75;0;130 m"     
    brown = "\u001b[ 38;2;150;75;0 m" 

class Highlight:
    red = "\u001b[ 48;2;255;0;0 m"
    black = "\u001b[ 48;2;0;0;0 m"
    white = "\u001b[ 48;2;255;255;255 m"
    grey = "\u001b[ 48;2;128;128;128 m"
    darkGrey = "\u001b[ 48;2;64;64;64 m"
    lightGrey = "\u001b[ 48;2;192;192;192 m"   
    red = "\u001b[ 48;2;255;0;0 m"
    green = "\u001b[ 48;2;0;255;0 m"
    blue = "\u001b[ 48;2;0;0;255 m"
    cyan = "\u001b[ 48;2;0;255;255 m"
    yellow = "\u001b[ 48;2;255;255;0 m"
    magenta = "\u001b[ 48;2;255;0;255 m"
    orange = "\u001b[ 48;2;255;165;0 m"
    purple = "\u001b[ 48;2;127;0;255 m"    
    pink = "\u001b[ 48;2;255;192;203 m" 
    brown = "\u001b[ 48;2;150;75;0 m" 
    violet = "\u001b[ 48;2;128;0;255 m" 
    indigo = "\u001b[ 48;2;75;0;130 m" 
    reset = "\u001b[ 48;2;0;0;0 m"
    
class Style:
    bold = "\u001b[ 1;2;0;0;0 m"
    italics = "\u001b[ 3;2;0;0;0 m"
    underline = "\u001b[ 4;2;0;0;0 m"
    default = "\u001b[ 5;2;0;0;0 m"
    reset = "\u001b[ 5;2;0;0;0 m"


#schoolID = ""
# use a default string to enable via web service as needed for (temp) global access
schoolID = "school_default"
def setSchool(id):
    global schoolID
    schoolID = id

# sep='' default argument required for the + concatenation training wheel
# named argument now required for voice
# def say(*args, voice = 0, sep = ''):
# removing for 2023 intermediate course, back to positional voice arg 
firstUtterance = True
def say(text, voice = 0, language = "english"):    
    global firstUtterance
    #text = ''.join([str(arg) for arg in args])
    # add a delay for the first utterance to allow speech engine to lazily load
    # TODO: not working!
    if firstUtterance:
        csinscTools.saySomething("", voice, language)    
        sleep(1)
        firstUtterance = False
    csinscTools.saySomething(text, voice, language)
    # block until finished speaking
    while csinscTools.isSpeaking():
        continue    
    
# overloaded on type:
# if string, act like input()
# if not-string, listen for 't' seconds
def listen(t):
    response = None
    if isinstance(t, str):
        print(t, end= "", flush=True)
        csinscTools.startListen()
        while csinscTools.isListening():
            continue
        response = csinscTools.stopListen()
        print(response)        
    else:            
        csinscTools.startListen()
        sleep(t)
        response = csinscTools.stopListen()
    return response
    
def write(text):
    print(text, end = "")
    
# as a result of + replacement in training wheels
# slowPrint() will require named arguments for delay and newLine
def slowPrint(*args, delay = 0.1, newline = True, sep = ''):
    text = ''.join([str(arg) for arg in args])
    escPattern = r"\[ (\d+);2;(\d+);(\d+);(\d+) m"         
    i = 0
    colour = ""
    while i < len(text):
        if text[i] == "\u001b":
            m = re.search(escPattern, text[i + 1:])
            if m:
                colour = text[i] + m.group()
                print(text[i] + m.group(), end = "")
                # m.span() not implemented in skulpt
                # +1 at the end to count the \u001b char at the start
                i += len(m.group()) + 1
                # no pause if there's a style change
                continue
            else:
                print(colour + text[i], end = "")            
                i += 1
        else:
            print(colour + text[i], end = "")
            i += 1
        sleep(delay)
    if newline:
        print()
    
def slowWrite(args, delay = 0.1):
    slowPrint(args, delay, newline = False)    


#def listen(text = ""):
def listenWithText(text = ""):
    print(text, end= "")
    csinscTools.startListen()
    while csinscTools.isListening():
        continue
    response = csinscTools.stopListen()
    print(response)
    return response
        
def sendsms(number, text):
    csinscTools.sendsms(number, text)    

#### sound functions
master_volume = 50

# volume is a number between 0 and 100
# divide by 100 before js call
def setVolume(volume):
    global master_volume
    master_volume = volume
    csinscTools.setVolume(volume / 100)

def playSound(url, loop = False):
    csinscTools.playSound(url, loop)
    while csinscTools.isLoadingSound():
        continue 
    setVolume(master_volume)

def playFreeSoundOrg(id):
    csinscTools.playFreeSoundOrg(id)
    while csinscTools.isLoadingSound():
        continue 
    setVolume(master_volume)

def stopSound():
    csinscTools.stopSound()


def printImage(url, width = None, height = None):
    csinscTools.addImage(url, width, height)
    while csinscTools.isLoadingImage():
        continue 

#### probability functions
def choose(*options):
    return choice(options)


#### helper prints without casting
def printWithNumbers(*args):
    print(*args, sep='')

def slowPrintWithNumbers(*args):
    text = ''.join([str(arg) for arg in args])
    slowPrint(text)

### helper inputs without casting
# scaffold to input() with casting later
def intInput(*args):
    result = None
    while result is None:
        try:
            result = int(input(*args))
        except ValueError as ve:
            print("Incorrect format: expected an integer. Please try again.")
    return result

def floatInput(*args):
    result = None
    while result is None:
        try:
            result = float(input(*args))
        except ValueError as ve:
            print("Incorrect format: expected a float. Please try again.")
    return result    

# same as floatInput but different error message
def numInput(*args):
    result = None
    while result is None:
        try:
            result = float(input(*args))
        except ValueError as ve:
            print("Incorrect format: expected a number. Please try again.")
    return result    

# just an alias for input(), but consistent with intInput() and floatInput() above
def strInput(*args):
    return input(*args)

# aliases for above
def input_integer(*args):
    return intInput(*args)
def input_float(*args):
    return floatInput(*args)
def input_number(*args):
    return numInput(*args)
def input_num(*args):
    return numInput(*args)
def input_string(*args):
    return input(*args)

################################################### openAI API ###################################################
# alias for getOpenAICompletion
def getChatGPTAnswer(prompt):
    return getOpenAICompletion(prompt)

def getOpenAICompletion(prompt):
    if len(schoolID) == 0:
        raise Exception("School ID not set. Please set it using the function setSchool().")       
    showSpinner()
    try:
        csinscTools.getOpenAICompletion(prompt, schoolID)
    except Exception as e:
        hideSpinner() 
        raise Exception("Error running getOpenAIImage with prompt: " + prompt)            
    while csinscTools.openAIWaiting:
        continue 
    hideSpinner()  
    if csinscTools.openAIStatus == 403:
        raise Exception("School ID not authenticated, please check the ID and try again, or contact CS in Schools to obtain an ID for your school.")    
    elif csinscTools.openAIStatus != 200:
        raise Exception("There was an error running the API on the server, please try again later or contact CS in Schools support. Details:" + str(csinscTools.cloudResponse))                     
    response = csinscTools.openAIResponse
    return str(response)

# DALL.E api
def getOpenAIImage(prompt):
    if len(schoolID) == 0:
        raise Exception("School ID not set. Please set it using the function setSchool().")       
    showSpinner()
    try:
        csinscTools.getOpenAIImage(prompt, schoolID)
    except Exception as e:
        hideSpinner() 
        raise Exception("Error running getOpenAIImage with prompt: " + prompt)            
    while csinscTools.openAIWaiting:
        continue 
    hideSpinner()  
    if csinscTools.openAIStatus == 403:
        raise Exception("School ID not authenticated, please check the ID and try again, or contact CS in Schools to obtain an ID for your school.")    
    elif csinscTools.openAIStatus != 200:
        raise Exception("There was an error running the API on the server, please try again later or contact CS in Schools support. Details:" + str(csinscTools.cloudResponse))                   
    response = csinscTools.openAIResponse
    return str(response)

################################################### cloud variables API ###################################################
def getCloudVariable(name):
    if len(schoolID) == 0:
        raise Exception("School ID not set. Please set it using the function setSchool().")       
    showSpinner()
    try:
        csinscTools.getCloudVariable(name, schoolID)
    except Exception as e:
        hideSpinner() 
        raise Exception("Error running getCloudVariable with params: " + name)           
    while csinscTools.cloudWaiting:
        continue 
    hideSpinner()       
    if csinscTools.cloudStatus == 403:
        raise Exception("School ID not authenticated, please check the ID and try again, or contact CS in Schools to obtain an ID for your school.")    
    elif csinscTools.cloudStatus == 418:
        raise Exception("Variable: " + name + " doesn't exist as a cloud variable.")    
    elif csinscTools.cloudStatus != 200:
        raise Exception("There was an error running the API on the server, please try again later or contact CS in Schools support. Details:" + str(csinscTools.cloudResponse["response"]))            
    value = csinscTools.cloudResponse["value"]
    type = csinscTools.cloudResponse["type"]    
    response = None
    if type == "int":
        response = int(value)
    elif type == "float":
        response = float(value)
    else:
        response = str(value) 
    return response         


def setCloudVariable(name, value):
    if len(schoolID) == 0:
        raise Exception("School ID not set. Please set it using the function setSchool().")    
    showSpinner()
    inputstring = str(type(value))
    typestring = inputstring.split("'")[1::2]
    if len(typestring) == 0:
        typestring = "str"
    else:
        typestring = typestring[0]
    try:
        csinscTools.setCloudVariable(name, value, typestring, schoolID)
    except Exception as e:
        hideSpinner() 
        raise Exception("Error running setCloudVariable with params: " + name + "," + value)            
    while csinscTools.cloudWaiting:
        continue 
    hideSpinner()      
    if csinscTools.cloudStatus == 403:
        raise Exception("School ID not authenticated, please check the ID and try again, or contact CS in Schools to obtain an ID for your school.")    
    elif csinscTools.cloudStatus != 200:
        raise Exception("There was an error running the API on the server, please try again later or contact CS in Schools support. Details:" + str(csinscTools.cloudResponse))        
    return str(csinscTools.cloudResponse)      
    
################################################### Translate API ###################################################
def getTranslation(text, languageTarget = "english"):
    if len(schoolID) == 0:
        raise Exception("School ID not set. Please set it using the function setSchool().")
    showSpinner()
    try:
        csinscTools.getTranslation(text, languageTarget, schoolID)
    except Exception as e:
        hideSpinner() 
        raise Exception("Error running getTranslation with params: " + text + "," + languageTarget)     
    while csinscTools.cloudWaiting:
        continue 
    hideSpinner()  
    if csinscTools.cloudStatus == 403:
        raise Exception("School ID not authenticated, please check the ID and try again, or contact CS in Schools to obtain an ID for your school.")    
    elif csinscTools.cloudStatus != 200:
        raise Exception("There was an error running the API on the server, please try again later or contact CS in Schools support.")    
    return str(csinscTools.cloudResponse)

################################################### Text to Speech API ###################################################
# this differs from the say() function in that it uses Google's TTS api - which allows
# for the text to be spoken in different languages / dialects (say() will only say words in english, so will mangle
# non english words, and skip Chinese characters altogether etc.)
# TODO: allow for different selection of voices and genders etc. as additional arguments
def speak(text, languageTarget = "english"):
    if len(text) > 1024:
        raise Exception("The text is too long, please try a shorter text (less than 1024 characters).")
    if len(schoolID) == 0:
        raise Exception("School ID not set. Please set it using the function setSchool().")
    showSpinner()
    try:
        csinscTools.getTTS(text, languageTarget, schoolID)
    except Exception as e:
        hideSpinner() 
        raise Exception("Error running getTTS with params: " + text + "," + languageTarget)        
    while csinscTools.cloudWaiting:
        continue 
    hideSpinner()  
    if csinscTools.cloudStatus == 403:
        raise Exception("School ID not authenticated, please check the ID and try again, or contact CS in Schools to obtain an ID for your school.")    
    elif csinscTools.cloudStatus != 200:
        raise Exception("There was an error running the API on the server, please try again later or contact CS in Schools support.")    
    #return str(csinscTools.cloudResponse)

################################################### test API ###################################################
def getTestAPI(param):
    if len(schoolID) == 0:
        raise Exception("School ID not set. Please set it using the function setSchool().")
    showSpinner()
    try:
        csinscTools.getTestAPI(param, schoolID)
    except Exception as e:
        hideSpinner() 
        raise Exception("Error running TestAPI with param: " + param)        
    while csinscTools.cloudWaiting:
        continue 
    hideSpinner()  
    if csinscTools.cloudStatus == 403:
        raise Exception("School ID not authenticated, please check the ID and try again, or contact CS in Schools to obtain an ID for your school.")    
    elif csinscTools.cloudStatus != 200:
        raise Exception("There was an error running the API on the server, please try again later or contact CS in Schools support.")    
    return str(csinscTools.cloudResponse)

################################################### webcam ###################################################
# shows the web cam in a pop up frame
def showWebCam():
    showSpinner()
    try:
        csinscTools.showWebCam()
    except Exception as e:
        hideSpinner() 
        raise Exception("Error attempting to show webcam")        
    while csinscTools.webcamWaiting:
        continue 
    hideSpinner()    
    return

# param is the URL of the image to predict
# topK will return the top K matching classes
def predictFromImage(param, topK = 1):
    showSpinner()
    try:
        # todo: branch depending of para datatype
        # exceptions won't be thrown here because it's an async javascript call
        csinscTools.predictFromImage(param, topK)
    except Exception as e:
        hideSpinner() 
        raise Exception("Error attempting to predict from an image URL using the Image model")        
    while csinscTools.webcamWaiting:
        continue 
    hideSpinner()    
    if csinscTools.webcamStatus != 0:
        raise Exception(str(csinscTools.webcamResponse))
        
    response = csinscTools.webcamResponse
    if topK == 1:
        response = response[0]
    return response

# will classify based on current streamed image from the webcam
def predictFromWebCam(topK = 1):
    showSpinner()
    try:
        # todo: branch depending of para datatype
        csinscTools.predictFromWebCam(topK)
     
        while csinscTools.webcamWaiting:
            continue 
    except Exception as e:
        hideSpinner() 
        raise Exception("Error attempting to predict from webcam using the Image model")           
    hideSpinner()    
    if csinscTools.webcamStatus != 0:
        raise Exception(str(csinscTools.webcamResponse))
    response = csinscTools.webcamResponse
    if topK == 1:
        response = response[0]
    return response

# loads the image classification model generated by teachablemachine.withgoogle.com
# url is the URL of the model uploaded to teachble machine site:
#   e.g.: https://teachablemachine.withgoogle.com/models/QboebBm84/
# if url is not specified, it will open up a file dialog allowing the user to
# select the model files from their filesystem
def loadImageModel(url = None):
    showSpinner()
    try:
        csinscTools.loadImageModel(url)
    except Exception as e:
        hideSpinner() 
        raise Exception("Error attempting to load the Image model")        
    while csinscTools.webcamWaiting:
        continue 
    hideSpinner()    
    return

# shows the web cam embedded in the console output
def printWebCam():
    showSpinner()
    try:
        csinscTools.printWebCam()
    except Exception as e:
        hideSpinner() 
        raise Exception("Error attempting to show webcam")        
    while csinscTools.webcamWaiting:
        continue 
    hideSpinner()    
    return    

def pauseWebCam():
    showSpinner()
    try:
        csinscTools.pauseWebCam()
    except Exception as e:
        hideSpinner() 
        raise Exception("Error attempting to show webcam")        
    while csinscTools.webcamWaiting:
        continue 
    hideSpinner()    
    return

def resumeWebCam():
    showSpinner()
    try:
        csinscTools.resumeWebCam()
    except Exception as e:
        hideSpinner() 
        raise Exception("Error attempting to show webcam")        
    while csinscTools.webcamWaiting:
        continue 
    hideSpinner()    
    return