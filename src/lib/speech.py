import csinscTools
from time import sleep

def say(text, voice = 0):
    csinscTools.saySomething(text, voice)
    
def listen(t):
    csinscTools.startListen()
    sleep(t)
    response = csinscTools.stopListen()
    return response
    
'''    
def listen(text = ""):
    print(text, end= "")
    csinsc.startListen()
    while csinsc.isListening():
        continue
    response = csinsc.stopListen()
    return response
'''