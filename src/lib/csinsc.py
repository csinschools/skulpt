import csinscTools
import re
from time import sleep

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

def say(text, voice = 0):
    csinscTools.saySomething(text, voice)
    
#def listenForSeconds(t):
def listen(t):
    csinscTools.startListen()
    sleep(t)
    response = csinscTools.stopListen()
    return response
    
def write(text):
    print(text, end = "")
    
def slowPrint(text, delay = 0.1, newline = True):
    escPattern = r"\[ (\d+);2;(\d+);(\d+);(\d+) m"         
    i = 0
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
                print(text[i], end = "")            
                i += 1
        else:
            print(text[i], end = "")
            i += 1
        sleep(delay)
    if newline:
        print()
    
def slowWrite(text, delay = 0.1):
    slowPrint(text, delay, newline = False)    


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

def playSound(url):
    csinscTools.playSound(url)

def playFreeSoundOrg(id):
    csinscTools.playFreeSoundOrg(id)

def printImage(url):
    addImage(url, None, None)
    # block until loaded
    while not imageLoaded:
        continue