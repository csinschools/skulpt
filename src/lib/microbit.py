import microBit

class Microbit:
    def __init__(self, blockUntilConnect = True, showProgress = True):
        self.uBit = microBit.Microbit()
        if blockUntilConnect:
            while not self.uBit.isConnected():
                if showProgress:
                    msg = self.uBit.dequeueStatusMessage()
                    if len(msg) > 0:
                        print(msg)
                continue        
            self.name = self.uBit.getName()
        if showProgress:
            print("Successfully connected")
        
    def setText(self, text):
        self.uBit.setText(text)
        
    def print(self, text):
        self.uBit.setText(text)
        
    def getButtonA(self):
        return self.uBit.getButtonA()
        
    def getButtonB(self):
        return self.uBit.getButtonB()
        
    def getButtons(self):
        buttonAState = self.uBit.getButtonA()
        buttonBState = self.uBit.getButtonB()
        
        return buttonAState, buttonBState
        
    def waitForButtonA(self):
        # wait for release first
        while self.uBit.getButtonA() != 0:
            continue
        # pressed
        while self.uBit.getButtonA() == 0:
            continue
        
            
    def waitForButtonB(self):
        # wait for release first
        while self.uBit.getButtonB() != 0:
            continue
        while self.uBit.getButtonB() == 0:
            continue
        
            
    def waitForButtonPress(self):
        buttonAState = self.uBit.getButtonA()
        buttonBState = self.uBit.getButtonB()
        
        while buttonAState == 0 and buttonBState == 0:
            buttonAState = self.uBit.getButtonA()
            buttonBState = self.uBit.getButtonB()
        
        return buttonAState, buttonBState
            
    def getTemperature(self):
        return self.uBit.getTemperature()
        
    def getBearing(self):
        return self.uBit.getBearing()
        
    def getMagnetometer(self):
        return (self.uBit.getMagnetometerX(), self.uBit.getMagnetometerY(), self.uBit.getMagnetometerZ())
         
    def getAccelerometer(self):
        return (self.uBit.getAccelerometerX(), self.uBit.getAccelerometerY(), self.uBit.getAccelerometerZ())
    
    def startRecordData(self, interval):
        self.uBit.recordData(interval * 1000)
        while not self.uBit.isRecording():
            continue
        return
        
    def set(self, col, row, value):
        self.uBit.updatePixel(4 - row, col, value)
        
    def clear(self):
        self.uBit.clearLED()    
        
    def fill(self):
        self.uBit.fillLED()  
        
    def stopRecordData(self):
        return self.uBit.stopRecordData()