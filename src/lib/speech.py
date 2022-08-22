import csinsc
from time import sleep

def say(text, voice = 0):
    csinsc.saySomething(text, voice)
    
def listen(t):
    csinsc.startListen()
    sleep(t)
    response = csinsc.stopListen()
    return response

#def listen(text = ""):
#    print(text, end= "")
#    csinsc.startListen()
#    while csinsc.isListening():
#        continue
#    response = csinsc.stopListen()
#    return response