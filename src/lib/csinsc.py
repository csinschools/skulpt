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
    red = "\u001b[ 38;2;255;0;0 m"
    green = "\u001b[ 38;2;0;255;0 m"
    blue = "\u001b[ 38;2;0;0;255 m"
    cyan = "\u001b[ 38;2;0;255;255 m"
    yellow = "\u001b[ 38;2;255;255;0 m"
    magenta = "\u001b[ 38;2;255;0;255 m"
    orange = "\u001b[ 38;2;255;165;0 m"
    purple = "\u001b[ 38;2;127;0;255 m"

class Highlight:
    red = "\u001b[ 48;2;255;0;0 m"
    black = "\u001b[ 48;2;0;0;0 m"
    white = "\u001b[ 48;2;255;255;255 m"
    grey = "\u001b[ 48;2;128;128;128 m"
    red = "\u001b[ 48;2;255;0;0 m"
    green = "\u001b[ 48;2;0;255;0 m"
    blue = "\u001b[ 48;2;0;0;255 m"
    cyan = "\u001b[ 48;2;0;255;255 m"
    yellow = "\u001b[ 48;2;255;255;0 m"
    magenta = "\u001b[ 48;2;255;0;255 m"
    orange = "\u001b[ 48;2;255;165;0 m"
    purple = "\u001b[ 48;2;127;0;255 m"    
    
class Style:
    bold = "\u001b[ 1;2;0;0;0 m"
    italics = "\u001b[ 3;2;0;0;0 m"
    underline = "\u001b[ 4;2;0;0;0 m"

# sep='' default argument required for the + concatenation training wheel
# named argument now required for voice
def say(*args, voice = 0, sep = ''):
    text = ''.join([str(arg) for arg in args])
    csinscTools.saySomething(text, voice)
    
# overloaded on type:
# if string, act like input()
# if not-string, listen for 't' seconds
def listen(t):
    response = None
    if isinstance(t, str):
        print(t, end= "")
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

def playSound(url):
    showSpinner()
    csinscTools.playSound(url)
    while csinscTools.isLoadingSound():
        continue 
    setVolume(master_volume)
    hideSpinner()

def playFreeSoundOrg(id):
    showSpinner()
    csinscTools.playFreeSoundOrg(id)
    while csinscTools.isLoadingSound():
        continue 
    setVolume(master_volume)
    hideSpinner()   

def stopSound():
    csinscTools.stopSound()

def printImage(url, width = None, height = None):
    addImage(url, width, height)
    # block until loaded
    while not imageLoaded:
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

#### openAI API
def getOpenAICompletion(prompt):
    showSpinner()
    csinscTools.getOpenAICompletion(prompt)
    while csinscTools.openAIWaiting:
        continue 
    hideSpinner()  
    return str(csinscTools.openAIResponse)

def getOpenAIImage(prompt):
    showSpinner()
    csinscTools.getOpenAIImage(prompt)
    while csinscTools.openAIWaiting:
        continue 
    hideSpinner()  
    return str(csinscTools.openAIResponse)
