//var codestoreURL = "https://codestore-348206.ts.r.appspot.com/";
var codestoreURL = "http://localhost:3000/";

var $builtinmodule = function(name)
{
    var mod = {};
        
    mod.Colour = Sk.misceval.buildClass(mod, function($gbl, $loc) {
        $loc.reset = new Sk.builtin.str("\u001b[ 0;2;0;0;0 m");
        $loc.red = new Sk.builtin.str("\u001b[ 38;2;255;0;0 m");
        $loc.black = new Sk.builtin.str("\u001b[ 38;2;0;0;0 m");
        $loc.white = new Sk.builtin.str("\u001b[ 38;2;255;255;255 m");
        $loc.grey = new Sk.builtin.str("\u001b[ 38;2;128;128;128 m");
        $loc.red = new Sk.builtin.str("\u001b[ 38;2;255;0;0 m");
        $loc.green = new Sk.builtin.str("\u001b[ 38;2;0;255;0 m");
        $loc.blue = new Sk.builtin.str("\u001b[ 38;2;0;0;255 m");
        $loc.cyan = new Sk.builtin.str("\u001b[ 38;2;0;255;255 m");
        $loc.yellow = new Sk.builtin.str("\u001b[ 38;2;255;255;0 m");
        $loc.magenta = new Sk.builtin.str("\u001b[ 38;2;255;0;255 m");
        $loc.orange = new Sk.builtin.str("\u001b[ 38;2;255;165;0 m");
        $loc.purple = new Sk.builtin.str("\u001b[ 38;2;127;0;255 m");        
    }, 'Colour', []);
    
    mod.Highlight = Sk.misceval.buildClass(mod, function($gbl, $loc) {
        $loc.black = new Sk.builtin.str("\u001b[ 48;2;0;0;0 m");
        $loc.white = new Sk.builtin.str("\u001b[ 48;2;255;255;255 m");
        $loc.grey = new Sk.builtin.str("\u001b[ 48;2;128;128;128 m");
        $loc.red = new Sk.builtin.str("\u001b[ 48;2;255;0;0 m");
        $loc.green = new Sk.builtin.str("\u001b[ 48;2;0;255;0 m");
        $loc.blue = new Sk.builtin.str("\u001b[ 48;2;0;0;255 m");    
        $loc.cyan = new Sk.builtin.str("\u001b[ 48;2;0;255;255 m");
        $loc.yellow = new Sk.builtin.str("\u001b[ 48;2;255;255;0 m");
        $loc.magenta = new Sk.builtin.str("\u001b[ 48;2;255;0;255 m");
        $loc.orange = new Sk.builtin.str("\u001b[ 48;2;255;165;0 m");
        $loc.purple = new Sk.builtin.str("\u001b[ 48;2;127;0;255 m");   
    }, 'Highlight', []);   

    mod.Style = Sk.misceval.buildClass(mod, function($gbl, $loc) {
        $loc.bold = new Sk.builtin.str("\u001b[ 1;2;0;0;0 m");    
        $loc.italics = new Sk.builtin.str("\u001b[ 3;2;0;0;0 m");    
        $loc.underline = new Sk.builtin.str("\u001b[ 4;2;0;0;0 m");    
    }, 'Style', []); 

    mod.synth = window.speechSynthesis;
    mod.voices = [];
    
    function populateVoiceList() {
      mod.voices = mod.synth.getVoices();
    }    
    
    populateVoiceList();
    if (mod.synth.onvoiceschanged !== undefined) {
      mod.synth.onvoiceschanged = populateVoiceList;
    }

    mod.say = new Sk.builtin.func((text, voice) => { 
      mod.saySomething(text, voice);
    })
    
    mod.saySomething = new Sk.builtin.func((text, voice) => {    
      const badWords = [
        'YXJzZQ==',         'YXJzZWhvbGU=',     'YmFsbHM=',         'YmFzdGFyZA==',
        'YmVlZg==',         'Y3VydGFpbnM=',     'Y3Vt',             'YmVsbGVuZA==',
        'Yml0Y2g=',         'YnVra2FrZQ==',     'YnVsbHNoaXQ=',     'Y2Fjaw==',
        'Y2hvYWQ=',         'Y29jaw==',         'Y29jayBjaGVlc2U=', 'Y29jayBqb2NrZXk=',
        'Y29ja3N1Y2tlcg==', 'Y293',             'Y3JhcA==',         'Y3Jpa2V5',
        'Y3VudA==',         'ZGFtbg==',         'ZGljaw==',         'ZGlja2hlYWQ=',
        'ZGlsZG8=',         'ZHVmZmVy',         'ZmFubnk=',         'ZmVjaw==',
        'ZmxhcHM=',         'ZnVjaw==',         'ZnVja2luZyBjdW50', 'ZnVja3RhcmQ=',
        'Z29kZGFt',         'amVzdXMgY2hyaXN0', 'aml6eg==',         'a25vYg==',
        'a25vYmhlYWQ=',     'bWFua3k=',         'bWluZ2U=',         'bW90aGVyZnVja2Vy',
        'bXVudGVy',         'bXVwcGV0',         'bmFmZg==',         'bml0d2l0',
        'bnVtcHR5',         'bnV0dGVy',         'cGlzcyBvZmY=',     'cGlzcy1mbGFwcw==',
        'cGlzc2Vk',         'cGlzc2VkIG9mZg==', 'cGxvbmtlcg==',     'cG9uY2U=',
        'cG9vZg==',         'cG91Zg==',         'cHJpY2s=',         'cHVzc3k=',
        'cmFwZXk=',         'c2hhZw==',         'c2hpdA==',         'c2thbms=',
        'c2xhZw==',         'c2xhcHBlcg==',     'c2x1dA==',         'c25hdGNo',
        'c3B1bms=',         'dGFydA==',         'dGl0',             'dG9zc2Vy',
        'dHJvbGxvcA==',     'dHdhdA==',         'd2Fua2Vy',         'd2Fua3N0YWlu',
        'd2hvcmU=',         'Y3VudA==',         'ZmFnZ290',         'bmlnZ2Vy',
        'cGVuaXM='
      ]

      const replies = [
        'nice try',   'better luck next time',                  'do you talk to your grandmother with that foul language?', 
        'ah nope',    'HELP! this student is trying to swear',  'get back to work please'
      ]

      for (let i = 0; i < badWords.length; i++) {
        let checkWord = atob(badWords[i])
        if (text.toString().toLowerCase().indexOf(checkWord) > -1) { 
          text = replies[Math.floor(Math.random() * (replies.length))];
        }
      }  
    
      var utterThis = new SpeechSynthesisUtterance(text);
      if (voice >= mod.voices.length) {
          voice %= mod.voices.length;
        } 
      utterThis.voice = mod.voices[voice];
      utterThis.pitch = 1;
      utterThis.rate = 1;
      mod.synth.speak(utterThis);        
      
      return new Sk.builtin.none;       
    });

    mod.isSpeaking = new Sk.builtin.func(() => {   
      return new Sk.builtin.bool(mod.synth.speaking);
    });    

    const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
    const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

    mod.startListen = new Sk.builtin.func(() => {
      mod.recognition = new SpeechRecognition();  

      mod.listening = true;
      mod.final_transcript = "";
      mod.interim_transcript = "";
      mod.recognition.continuous = false;
      mod.recognition.lang = 'en-AU';
      mod.recognition.interimResults = false;
      mod.recognition.maxAlternatives = 1;

      mod.recognition.onresult = function(event) {
        mod.interim_transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            mod.final_transcript += event.results[i][0].transcript;
            console.log("Final transcript:" + mod.final_transcript);
            mod.listening = false;
          } else {
            mod.interim_transcript += event.results[i][0].transcript;
          }
        }
      }

      mod.recognition.onspeechend = function() {        
        mod.recognition.stop();
      } 
      
      mod.recognition.onnomatch = function(event) {
        console.log("I didn\'t recognize that, sorry.");
      }
      
      mod.recognition.onerror = function(event) {
        console.log("Error occurred in recognition: " + event.error);
      }

      mod.recognition.start();
      // we could make it sleep here, then mod.recgonition.stop(), but idk how to make javascript sleep
      return new Sk.builtin.none; 
    })

    mod.isListening = new Sk.builtin.func(() => {   
      return new Sk.builtin.bool(mod.listening);
    });
    
    mod.getFinalTranscript = new Sk.builtin.func(() => {   
      return new Sk.builtin.str(mod.final_transcript);
    });

    mod.getInterimTranscript = new Sk.builtin.func(() => {   
      return new Sk.builtin.str(mod.interim_transcript);
    });

    mod.stopListen = new Sk.builtin.func(() => {   
      var text = "";
      if (mod.final_transcript != ""){
        text = new Sk.builtin.str(mod.final_transcript);
      } else{
        text = new Sk.builtin.str(mod.interim_transcript);
      }

      console.log("stopListen() transcript:" + text);
      return text;      
    });

    /////////////////////////////////// image functions ///////////////////////////
    mod.loadingImage = false;
    mod.isLoadingImage = new Sk.builtin.func(() => {   
      return new Sk.builtin.bool(mod.loadingImage);
    });      

    mod.addImage = new Sk.builtin.func((url, width, height) => {
      mod.loadingImage = true;
      if (url.v !== null && url.v.length > 0) { 
        addImage(url.v, width.v, height.v, () => { mod.loadingImage = false; }, () => { mod.loadingImage = false;});
      };});   

    /////////////////////////////////// audio functions ///////////////////////////
    // only 1 audioElement at a time

    mod.audioElement = null;
    mod.loadingSound = false;

    mod.isLoadingSound = new Sk.builtin.func(() => {   
      return new Sk.builtin.bool(mod.loadingSound);
    });    

    mod.setVolume = new Sk.builtin.func((volume) => {
      if (mod.audioElement !== null) {
        mod.audioElement.volume = volume;
      }
    });

    mod.stopSound = new Sk.builtin.func(() => {
      stopSound();
    });
    
    mod.playSound = new Sk.builtin.func((url, loop) => {
      mod.loadingSound = true;
      createAudioElement(url, loop, () => { mod.loadingSound = false; }, () => { mod.loadingSound = false;});                
    });

    mod.playFreeSoundOrg = new Sk.builtin.func((id) => {
      mod.loadingSound = true;
      playFreeSound(id, () => { mod.loadingSound = false; }, () => { mod.loadingSound = false;});       
    });

    /////////////////////////////////////// Open AI APIs ///////////////////////////////////////

    mod.openAIWaiting = false;
    mod.openAIResponse = "";
    mod.openAIStatus = 0;

    mod.getOpenAICompletion = new Sk.builtin.func((prompt, school) => {
      mod.openAIWaiting = true;
      mod.openAIResponse = "";
      mod.openAIStatus = 0;
      var xhr = new XMLHttpRequest();      
      const requestURL =  `${codestoreURL}openai/completion?prompt=${prompt}&school=${school}`;//"https://codestore-348206.ts.r.appspot.com/openai/completion?prompt=" + prompt;
      console.log(requestURL);
      xhr.open("GET", requestURL, true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.timeout = 20000; // time in milliseconds
      xhr.ontimeout = (e) => {
        console.log("Timeout");
        mod.openAIWaiting = false;
        mod.openAIStatus = Sk.ffi.remapToPy(408);
      };        
      xhr.onerror = function() {
        console.log("Error");
        mod.openAIWaiting = false;
        mod.openAIStatus = Sk.ffi.remapToPy(408);
      }      
      xhr.onreadystatechange = function() {
        console.log("Response:" + xhr.responseText);        
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {          
          if (xhr.responseText.length > 0) {
            const response =  JSON.parse(Sk.ffi.remapToPy(xhr.responseText));
            mod.openAIResponse = response["response"];
            mod.openAIStatus = Sk.ffi.remapToPy(parseInt(response["status"]));                
          }
          mod.openAIWaiting = false;
        }
      }       
      xhr.send();  
    });    

    mod.getOpenAIImage = new Sk.builtin.func((prompt, school) => {
      mod.openAIWaiting = true;
      mod.openAIResponse = "";
      mod.openAIStatus = 0;
      var xhr = new XMLHttpRequest();      
      const requestURL =  `${codestoreURL}openai/image?prompt=${prompt}&school=${school}`;
      console.log(requestURL);
      xhr.open("GET", requestURL, true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.timeout = 20000; // time in milliseconds
      xhr.ontimeout = (e) => {
        console.log("Timeout");
        mod.openAIWaiting = false;
        mod.openAIStatus = Sk.ffi.remapToPy(408);
      };        
      xhr.onerror = function() {
        console.log("Error");
        mod.openAIWaiting = false;
        mod.openAIStatus = Sk.ffi.remapToPy(408);
      }      
      xhr.onreadystatechange = function() {
        console.log("Response:" + xhr.responseText);        
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {          
          if (xhr.responseText.length > 0) {
            const response =  JSON.parse(Sk.ffi.remapToPy(xhr.responseText));
            mod.openAIResponse = response["response"];
            mod.openAIStatus = Sk.ffi.remapToPy(parseInt(response["status"]));                
          }
          mod.openAIWaiting = false;
        }
      }       
      xhr.send();    
    });    

    //////////////////////////////////////////// Cloud Variables API ////////////////////////////////////////////
    mod.cloudWaiting = false;
    mod.cloudResponse = "";
    mod.cloudStatus = 0;

    mod.setCloudVariable = new Sk.builtin.func((name, value, type, school) => {
      value = encodeURIComponent(value)      
      console.log("Attempting to set cloud variable:" + name + " as:" + value);
      mod.cloudWaiting = true;
      mod.cloudResponse = "";
      mod.cloudStatus = 0;
      var xhr = new XMLHttpRequest();      
      const requestURL =  `${codestoreURL}cloudvars/put?name=${name}&val=${value}&type=${type}&school=${school}`;//`https://codestore-348206.ts.r.appspot.com/cloudvars/put?name=${name}&val=${value}&type=${type}`
      console.log(requestURL);
      xhr.open("GET", requestURL, true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.timeout = 10000; // time in milliseconds
        xhr.ontimeout = (e) => {
        console.log("Timeout");
        mod.cloudWaiting = false;
        mod.cloudResponse = "Error trying to set cloud variable " + name + ": timeout.";
        mod.cloudStatus = Sk.ffi.remapToPy(408);
      };       
      xhr.onerror = function() {
        console.log("Error");
        mod.cloudWaiting = false;
        mod.cloudResponse = "Error trying to set cloud variable " + name + ": problems with accessing the API.";
        mod.cloudStatus = Sk.ffi.remapToPy(408);
      }      
      xhr.onreadystatechange = function() {
        console.log("Response:" + xhr.responseText);        
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {          
          if (xhr.responseText.length > 0) {
            const response =  JSON.parse(Sk.ffi.remapToPy(xhr.responseText));
            mod.cloudResponse = response["response"];
            mod.cloudStatus = Sk.ffi.remapToPy(parseInt(response["status"]));
            mod.cloudWaiting = false;
          } 
        } 
      }
      xhr.send();   
    }); 

    mod.getCloudVariable = new Sk.builtin.func((name, school) => {      
        mod.cloudWaiting = true;
        mod.cloudResponse = "";
        mod.cloudStatus = 0;
        var xhr = new XMLHttpRequest();      
        const requestURL =  `${codestoreURL}cloudvars/get?name=${name}&school=${school}`;//const requestURL =  `https://codestore-348206.ts.r.appspot.com/cloudvars/get?name=${name}`;
        console.log(requestURL);
        xhr.open("GET", requestURL, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.timeout = 10000; // time in milliseconds    
        xhr.ontimeout = (e) => {
          console.log("Timeout");
          mod.cloudWaiting = false;
          mod.cloudStatus = Sk.ffi.remapToPy(408);
          mod.cloudResponse = "Error trying to get cloud variable " + name + ": timeout.";
        };          
        xhr.onerror = function() {
          console.log("Error");
          mod.cloudWaiting = false;
          mod.cloudStatus = Sk.ffi.remapToPy(408);
          mod.cloudResponse = "Error trying to set cloud variable " + name + ": problems with accessing the API.";
        }        
        xhr.onreadystatechange = function() {
          console.log("Response:" + xhr.responseText);          
          if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {            
            if (xhr.responseText.length > 0) {
              let response =  JSON.parse(xhr.responseText);               
              response["value"] = decodeURIComponent(response["value"]);
              mod.cloudResponse = Sk.ffi.remapToPy(response);                
              mod.cloudStatus = Sk.ffi.remapToPy(parseInt(response["status"]));
              mod.cloudWaiting = false;
            } 
          }
        }         
        xhr.send();   

  });       

  //////////////////////////////////////////// Send SMS API ////////////////////////////////////////////
  mod.sendsms = new Sk.builtin.func((number, message, school) => {
    var xhr = new XMLHttpRequest();      
    const requestURL =  `${codestoreURL}sendtext?number=${number}&msg=${message}&school=${school}`;
    console.log(requestURL);
    xhr.open("GET", requestURL, true);
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.withCredentials = false;
    xhr.timeout = 20000; // time in milliseconds
    xhr.ontimeout = (e) => {
      console.log("sendsms api Timeout");
    };        
    xhr.onerror = function() {
      console.log("sendsms api Error");
    }      
    xhr.onreadystatechange = function() {
      console.log("Response:" + xhr.responseText);        
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {          
        console.log(this.responseText);
      }
    }       
    xhr.send();               
  });  
  
  //////////////////////////////////////////// Test API ////////////////////////////////////////////

  mod.getTestAPI = new Sk.builtin.func((param, school) => {      
    mod.cloudWaiting = true;
    mod.cloudResponse = "";
    mod.cloudStatus = Sk.ffi.remapToPy(408);
    var xhr = new XMLHttpRequest();      
    const requestURL =  `${codestoreURL}test/testapi?param=${param}&school=${school}`;
    console.log(requestURL);
    xhr.open("GET", requestURL, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.timeout = 10000; // time in milliseconds
    xhr.ontimeout = (e) => {
      console.log("Timeout");
      mod.cloudWaiting = false;
      mod.cloudStatus = Sk.ffi.remapToPy(408);
    };        
    xhr.onerror = function() {
      console.log("Error");
      mod.cloudWaiting = false;
      mod.cloudStatus = Sk.ffi.remapToPy(408);
    }      
    xhr.onreadystatechange = function() {
      console.log("Response:" + xhr.responseText);       
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {          
        try {
          if (xhr.responseText.length > 0) {              
            const response =  JSON.parse(Sk.ffi.remapToPy(xhr.responseText));
            mod.cloudResponse = response["response"];
            mod.cloudStatus = Sk.ffi.remapToPy(parseInt(response["status"]));
            mod.cloudWaiting = false;
          } 
        } catch (error) {
          mod.cloudWaiting = false;
          mod.cloudStatus = Sk.ffi.remapToPy(408);
          throw error;
        }
      }
    }       
    xhr.send();   
  });          

  return mod;
}

// test comment to make sure github set up properly