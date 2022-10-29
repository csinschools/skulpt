import microBit
from time import sleep, time
from csinsc import Colour


class Microbit:
    def __init__(self, blockUntilConnect = True, showProgress = True, timeout = 20):
        self.uBit = microBit.Microbit()
        print("Connecting...please wait")
        success = True
        services = 0
        now = time()
        if blockUntilConnect:
            while not self.uBit.isConnected():
                msg = self.uBit.dequeueStatusMessage()
                if len(msg) > 0:
                    if msg[:5].lower() == "error":
                        print(Colour.red + msg + Colour.reset)
                        success = False
                    else:
                        if showProgress: 
                            print(msg)
                        services += 1
            while services < 4 and success != False:
                # timeout
                if time() - now > timeout:
                    success = False
                    print(Colour.red + "Connection has taken too long." + Colour.reset)
                msg = self.uBit.dequeueStatusMessage()
                if len(msg) > 0:
                    if msg[:5].lower() == "error":
                        print(Colour.red + msg + Colour.reset)   
                        success = False
                    else:
                        if showProgress:
                            print(msg)
                        services += 1                
            self.name = self.uBit.getName()
        if success:
            print(Colour.green + "Houston, I'm ready to run code on " + Colour.reset + self.name)
            print("- - - - - - - - - - - - - - - - - - - - - - - - - - - -")
        else:
            print(Colour.blue + "There was a problem connecting to the microbit, please try again." + Colour.reset)
    
    def getName(self):
        return self.uBit.getName()

    def setText(self, text):                    # scrolls the text across the screen
        self.uBit.setText(text)

    def print(self, text):                      # scrolls the text across the screen
        self.uBit.setText(text)

    def isButtonAPressed(self):                 # returns whether button A was pressed (ie. released and now held)
        return self.uBit.isButtonAPressed()

    def isButtonBPressed(self):                       
        return self.uBit.isButtonBPressed()     # returns whether button B was pressed (ie. released and now held)

    def getButtonA(self):                       # return 0 if not held down, 1 if held down
        return self.uBit.getButtonA()

    def getButtonB(self):                       # return 0 if not held down, 1 if held down
        return self.uBit.getButtonB()

    def getButtons(self):                       # returns a list of [button A, button B]
        buttonAState = self.uBit.getButtonA()
        buttonBState = self.uBit.getButtonB()

        return buttonAState, buttonBState

    def waitForButtonA(self):                   # waits for button A to be released, then pressed
        # wait for release first
        while self.uBit.getButtonA() != 0:
            continue
        # pressed
        while self.uBit.getButtonA() == 0:
            continue

    def waitForButtonB(self):                   # waits for button B to be released, then pressed
        # wait for release first
        while self.uBit.getButtonB() != 0:
            continue
        while self.uBit.getButtonB() == 0:
            continue

    def waitForButtonPress(self):               # waits for any button to be released, then pressed
        buttonAState = self.uBit.getButtonA()
        buttonBState = self.uBit.getButtonB()

        while buttonAState == 0 and buttonBState == 0:
            buttonAState = self.uBit.getButtonA()
            buttonBState = self.uBit.getButtonB()

        sleep(0.5)
        return buttonAState, buttonBState

    def getTemperature(self):                   # returns integer of temp reading
        return self.uBit.getTemperature()

    def getBearing(self):                       # returns number between 0 and 360 
        return self.uBit.getBearing()

    def getMagnetometer(self):                  # returns a list of massive neg/pos values (X, Y, Z) --> we need to return value between 0 and 360
        return (self.uBit.getMagnetometerX(), self.uBit.getMagnetometerY(), self.uBit.getMagnetometerZ())

    def getAccelerometer(self):                 # returns acceleration in [X, Y, Z] 
        return [self.uBit.getAccelerometerX(), self.uBit.getAccelerometerY(), self.uBit.getAccelerometerZ()] 

    def getAccelerometerX(self):                # returns acceleration in X 
        return self.uBit.getAccelerometerX() 

    def getAccelerometerY(self):                # returns acceleration in Y 
        return self.uBit.getAccelerometerY()

    def getAccelerometerZ(self):                # returns acceleration in Z 
        return self.uBit.getAccelerometerZ() 

    def startRecordData(self, interval):
        self.uBit.recordData(interval * 1000)
        while not self.uBit.isRecording():
            continue
        return

    def set(self, col, row, value):             # True: turns LED on, False: turns LED off
        self.uBit.updatePixel(4 - row, col, value)
        sleep(0.05)

    def setLEDs(self, matrix):
        self.uBit.setLEDs(matrix)


    def setLED(self, col, row, value):          # True: turns LED on, False: turns LED off
        self.uBit.updatePixel(4 - row, col, value)
        sleep(0.05)

    def clear(self):                            # Turns off LEDs
        self.uBit.clearLED()
        sleep(0.05)

    def fill(self):                             # Turns on all LEDs
        self.uBit.fillLED()
        sleep(0.05)
        
    def writePin(self, pin, value):
        self.uBit.writePin(pin, value)

    def stopRecordData(self):
        return self.uBit.stopRecordData()
    
    def getCompass(self, bearing):
        if bearing > 22 and bearing <= 67:
            facing = "NE"
        elif bearing > 67 and bearing <= 112:
            facing = "E"
        elif bearing > 112 and bearing <= 157:
            facing = "SE"
        elif bearing > 157 and bearing <= 202:
            facing = "S"
        elif bearing > 202 and bearing <= 247:
            facing = "SW"
        elif bearing > 247 and bearing <= 292:
            facing = "W"
        elif bearing > 292 and bearing <= 337:
            facing = "NW"
        elif bearing > 337 and bearing <= 359 or bearing >= 0 and bearing <= 22:
            facing = "NW"
        else:
            facing = "Number out of range 0 to 359"
        return facing