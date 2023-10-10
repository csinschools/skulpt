var codestoreURL = "https://codestore-348206.ts.r.appspot.com/";
//var codestoreURL = "http://localhost:3000/";

var $builtinmodule = function(name)
{

    var mod = {};
        
    mod.Colour = Sk.misceval.buildClass(mod, function($gbl, $loc) {
        $loc.reset = new Sk.builtin.str("\u001b[ 0;2;0;0;0 m");
        $loc.red = new Sk.builtin.str("\u001b[ 38;2;255;0;0 m");
        $loc.black = new Sk.builtin.str("\u001b[ 38;2;0;0;0 m");
        $loc.white = new Sk.builtin.str("\u001b[ 38;2;255;255;255 m");
        $loc.grey = new Sk.builtin.str("\u001b[ 38;2;128;128;128 m");
        $loc.lightGrey = new Sk.builtin.str("\u001b[ 38;2;192;192;192 m");
        $loc.darkGrey = new Sk.builtin.str("\u001b[ 38;2;64;64;64 m");
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
        $loc.lightGrey = new Sk.builtin.str("\u001b[ 48;2;192;192;192 m");
        $loc.darkGrey = new Sk.builtin.str("\u001b[ 48;2;64;64;64 m");        
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
    
    mod.saySomething = new Sk.builtin.func((text, voice, lang) => {    
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

      if (lang !== undefined) {
        lang = lang.toString().toLowerCase();
        if (!(lang in languages)) {
          throw "Unknown language";
        }
        lang = languages[lang];
        utterThis.lang = lang;
      }

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
        mod.audioElement.volume = volume.v;
      }
    });

    mod.stopSound = new Sk.builtin.func(() => {
      stopSound();
    });
    
    mod.playSound = new Sk.builtin.func((url, loop) => {
      mod.loadingSound = true;
      mod.audioElement = createAudioElement(url, loop.v, () => { mod.loadingSound = false; }, () => { mod.loadingSound = false;});                
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
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {          
            if (xhr.responseText.length > 0) {
              const response =  JSON.parse(Sk.ffi.remapToPy(xhr.responseText));
              mod.openAIResponse = response["response"];
              mod.openAIStatus = Sk.ffi.remapToPy(parseInt(response["status"])); 
              mod.openAIWaiting = false;               
            }
          } else if (this.status === 429) {
            console.log("Error:" + this.readyState + "," + this.status);
            mod.openAIResponse = new Sk.builtin.str("Accessing this getOpenAICompletion() too quickly. Please slow down your code using sleep() between API calls.");              
            mod.openAIStatus = Sk.ffi.remapToPy(429);
            mod.openAIWaiting = false;
          } else {
            console.log("Error:" + this.readyState + "," + this.status);
            mod.openAIResponse = new Sk.builtin.str("Error trying to access the getOpenAICompletion() API.");              
            mod.openAIStatus = Sk.ffi.remapToPy(408);
            mod.openAIWaiting = false;          
          }
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
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {          
            if (xhr.responseText.length > 0) {
              const response =  JSON.parse(Sk.ffi.remapToPy(xhr.responseText));
              mod.openAIResponse = response["response"];
              mod.openAIStatus = Sk.ffi.remapToPy(parseInt(response["status"]));                
              mod.openAIWaiting = false;
            }
          } else if (this.status === 429) {
            console.log("Error:" + this.readyState + "," + this.status);
            mod.openAIResponse = new Sk.builtin.str("Accessing this getOpenAIImage() too quickly. Please slow down your code using sleep() between API calls.");              
            mod.openAIStatus = Sk.ffi.remapToPy(429);
            mod.openAIWaiting = false;
          } else {
            console.log("Error:" + this.readyState + "," + this.status);
            mod.openAIResponse = new Sk.builtin.str("Error trying to access the getOpenAIImage() API.");              
            mod.openAIStatus = Sk.ffi.remapToPy(408);
            mod.openAIWaiting = false;          
          }          
        }
      }       
      xhr.send();    
    });    

    //////////////////////////////////////////// Cloud Variables API ////////////////////////////////////////////
    mod.cloudWaiting = false;
    mod.cloudResponse = "";
    mod.cloudStatus = 0;

    mod.setCloudVariable = new Sk.builtin.func((name, value, type, const_type, school) => {
      value = encodeURIComponent(value)      
      console.log("Attempting to set cloud variable:" + name + " as:" + value);
      mod.cloudWaiting = true;
      mod.cloudResponse = "";
      mod.cloudStatus = 0;
      var xhr = new XMLHttpRequest();      
      const requestURL =  `${codestoreURL}cloudvars/put?name=${name}&val=${value}&type=${type}&school=${school}&const_type=${const_type}`;//`https://codestore-348206.ts.r.appspot.com/cloudvars/put?name=${name}&val=${value}&type=${type}`
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
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {          
            if (xhr.responseText.length > 0) {
              const response =  JSON.parse(Sk.ffi.remapToPy(xhr.responseText));
              mod.cloudResponse = response["response"];
              mod.cloudStatus = Sk.ffi.remapToPy(parseInt(response["status"]));
              mod.cloudWaiting = false;
            }
          } else if (this.status === 429) {
              console.log("Error:" + this.readyState + "," + this.status);
              mod.cloudResponse = new Sk.builtin.str("Accessing cloud variables too quickly. Please slow down your code using sleep() between cloud variables.");              
              mod.cloudStatus = Sk.ffi.remapToPy(429);
              mod.cloudWaiting = false;
          } else {
              console.log("Error:" + this.readyState + "," + this.status);
              mod.cloudResponse = new Sk.builtin.str("Error trying to set cloud variable " + name + ": problems with accessing the API.");              
              mod.cloudStatus = Sk.ffi.remapToPy(408);
              mod.cloudWaiting = false;
          }          
        } 
      }
      xhr.send();   
    }); 

    mod.delCloudVariable = new Sk.builtin.func((name, school) => {
      console.log("Attempting to del cloud variable:" + name);
      mod.cloudWaiting = true;
      mod.cloudResponse = "";
      mod.cloudStatus = 0;
      var xhr = new XMLHttpRequest();      
      const requestURL =  `${codestoreURL}cloudvars/del?name=${name}&school=${school}`;//`https://codestore-348206.ts.r.appspot.com/cloudvars/put?name=${name}&val=${value}&type=${type}`
      console.log(requestURL);
      xhr.open("GET", requestURL, true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.timeout = 10000; // time in milliseconds
        xhr.ontimeout = (e) => {
        console.log("Timeout");
        mod.cloudWaiting = false;
        mod.cloudResponse = "Error trying to del cloud variable " + name + ": timeout.";
        mod.cloudStatus = Sk.ffi.remapToPy(408);
      };       
      xhr.onerror = function() {
        console.log("Error");
        mod.cloudWaiting = false;
        mod.cloudResponse = "Error trying to del cloud variable " + name + ": problems with accessing the API.";
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
          if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {            
              if (xhr.responseText.length > 0) {
                let response =  JSON.parse(xhr.responseText);               
                response["value"] = decodeURIComponent(response["value"]);

                // NOTE: response is handled differently in this API vs all the rest
                // the reponse contains both the "value" and the "type" which is exposed
                // to the python wrapper to cast the value into the type
                // other APIs will simply just expose the response["response"] field and not the entire dict                
                mod.cloudResponse = Sk.ffi.remapToPy(response);               
                
                mod.cloudStatus = Sk.ffi.remapToPy(parseInt(response["status"]));
                mod.cloudWaiting = false;
              } 
            } else if (this.status === 429) {
              console.log("Error:" + this.readyState + "," + this.status);
              mod.cloudResponse = new Sk.builtin.str("Accessing cloud variables too quickly. Please slow down your code using sleep() between cloud variables.");              
              mod.cloudStatus = Sk.ffi.remapToPy(429);
              mod.cloudWaiting = false;
            } else {
              console.log("Error:" + this.readyState + "," + this.status);
              mod.cloudResponse = new Sk.builtin.str("Error trying to set cloud variable " + name + ": problems with accessing the API.");              
              mod.cloudStatus = Sk.ffi.remapToPy(408);
              mod.cloudWaiting = false;
            }

          }
        }         
        xhr.send();   

  });       

  //////////////////////////////////////////// Send SMS API ////////////////////////////////////////////
  /*
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
  */

  //////////////////////////////////////////// Translate API ////////////////////////////////////////////
  mod.getTranslation = new Sk.builtin.func((text, target, school) => {      
    mod.cloudWaiting = true;
    mod.cloudResponse = "";
    mod.cloudStatus = Sk.ffi.remapToPy(408);
    var xhr = new XMLHttpRequest();      
    const requestURL =  `${codestoreURL}translate?text=${text}&target=${target}&school=${school}`;
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
      if (this.readyState === XMLHttpRequest.DONE) {          
        if (this.status === 200) {
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
            mod.cloudResponse = new Sk.builtin.str("Error with attempting to format the translated response from getTranslation():" + error); 
            throw error;
          }         
        } else if (this.status === 429) {
          console.log("Error:" + this.readyState + "," + this.status);
          mod.cloudResponse = new Sk.builtin.str("Accessing getTranslation() too quickly. Please slow down your code using sleep() between getTranslation() calls.");              
          mod.cloudStatus = Sk.ffi.remapToPy(429);
          mod.cloudWaiting = false;
        } else {
          console.log("Error:" + this.readyState + "," + this.status);
          mod.cloudResponse = new Sk.builtin.str("Error trying to access getTranslation() API.");              
          mod.cloudStatus = Sk.ffi.remapToPy(408);
          mod.cloudWaiting = false;
        }
      }
    }       
    xhr.send();   
  });    


  //////////////////////////////////////////// Text to Speech API ////////////////////////////////////////////
  mod.getTTS = new Sk.builtin.func((text, language, school) => {      
    mod.cloudWaiting = true;
    mod.cloudResponse = "";
    mod.cloudStatus = Sk.ffi.remapToPy(408);
    var xhr = new XMLHttpRequest();      
    const requestURL =  `${codestoreURL}tts?text=${text}&language=${language}&school=${school}`;
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
      if (this.readyState === XMLHttpRequest.DONE) {          
        if (this.status === 200) {
          try {
            if (xhr.responseText.length > 0) {              
              const response =  JSON.parse(Sk.ffi.remapToPy(xhr.responseText));
              mod.cloudResponse = response["response"];
              mod.cloudStatus = Sk.ffi.remapToPy(parseInt(response["status"]));
              mod.cloudWaiting = false;
              var audioData = new Uint8Array(mod.cloudResponse["data"]);
              const blob = new Blob([audioData.buffer],{type:'audio/mp3'});
              new Audio( URL.createObjectURL(blob) ).play()              
            } 
          } catch (error) {
            mod.cloudWaiting = false;
            mod.cloudStatus = Sk.ffi.remapToPy(408);
            mod.cloudResponse = new Sk.builtin.str("Error with attempting to format the audio response from getTTS():" + error); 
            throw error;
          }         
        } else if (this.status === 429) {
          console.log("Error:" + this.readyState + "," + this.status);
          mod.cloudResponse = new Sk.builtin.str("Accessing getTTS() too quickly. Please slow down your code using sleep() between getTTS() calls.");              
          mod.cloudStatus = Sk.ffi.remapToPy(429);
          mod.cloudWaiting = false;
        } else {
          console.log("Error:" + this.readyState + "," + this.status);
          mod.cloudResponse = new Sk.builtin.str("Error trying to access getTTS() API.");              
          mod.cloudStatus = Sk.ffi.remapToPy(408);
          mod.cloudWaiting = false;
        }
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
  
  //////////////////////////////////////////// Web Cam ////////////////////////////////////////////
  mod.webcamWaiting = false;
  mod.webcamResponse = "";
  mod.tmImageModel = null;
  mod.webcamStatus = Sk.ffi.remapToPy(0);

  mod.showWebCam = new Sk.builtin.func(async () => { 
    mod.webcamWaiting = true;
    // function in console.js
    await createWebCam();
    mod.webcamWaiting = false;
  });

  mod.printWebCam = new Sk.builtin.func(async () => { 
    mod.webcamWaiting = true;
    // function in console.js
    await printWebCam();
    mod.webcamWaiting = false;
  });  

  mod.getWebCamImage = new Sk.builtin.func(() => { 
    return getImageFromWebCam();
  });    

  async function tmImageDialogBtnPressed() {   
      // you need to create File objects, like with file input elements (<input type="file" ...>)
      const uploadModel = document.getElementById('upload-model');
      const uploadWeights = document.getElementById('upload-weights');
      const uploadMetadata = document.getElementById('upload-metadata');
      mod.tmImageModel = await tmImage.loadFromFiles(uploadModel.files[0], uploadWeights.files[0], uploadMetadata.files[0]);  
      mod.webcamWaiting = false;      
  }

  mod.loadImageModel = new Sk.builtin.func(async (url) => {
    mod.webcamWaiting = true;
    if (url.v === null) {
      document.getElementById("tmImageDialogOKBtn").removeEventListener("click", tmImageDialogBtnPressed);
      document.getElementById("tmImageDialogOKBtn").addEventListener("click", tmImageDialogBtnPressed);
      await loadImageModel();    
    } else {
      modelurl = url.v;
      if (modelurl.slice(-1) !== "/") {
        modelurl = modelurl +  "/";
      }
      mod.tmImageModel = await tmImage.load(modelurl + "model.json", modelurl + "metadata.json");  
      mod.webcamWaiting = false; 
    }
  });

  mod.pauseWebCam = new Sk.builtin.func(async () => { 
    mod.webcamWaiting = true;
    // function in console.js
    pauseWebCam();
    mod.webcamWaiting = false;
  });

  mod.resumeWebCam = new Sk.builtin.func(async () => { 
    mod.webcamWaiting = true;
    // function in console.js
    resumeWebCam();
    mod.webcamWaiting = false;
  });

  mod.predictFromImage = new Sk.builtin.func(async (url, topK) => {
    mod.webcamWaiting = true;
    mod.webcamStatus = Sk.ffi.remapToPy(0);
    if (Sk.ffi.remapToJs(topK) == -1) {
      topK = mod.tmImageModel.getTotalClasses();
    }
    var img = new Image();
    try {
      if (url.v !== null && url.v.length > 0) {       
        await new Promise((resolve) => { img.onload = resolve; img.src = url.v; img.crossOrigin = 'anonymous';});      
      }
      await tmImagePredict(img, topK);
    } catch (error) {
      mod.webcamWaiting = false;
      mod.webcamStatus = Sk.ffi.remapToPy(1);
      mod.webcamResponse = new Sk.builtin.str("Error with predicting from image.");
      throw error;
    }
  });

  mod.predictFromWebCam = new Sk.builtin.func(async (topK) => {
    mod.webcamWaiting = true;
    mod.webcamStatus = Sk.ffi.remapToPy(0);
    if (Sk.ffi.remapToJs(topK) == -1) {
      topK = mod.tmImageModel.getTotalClasses();
    }    
    canvas = getWebCamCanvas();
    if (canvas === null) {
      mod.webcamWaiting = false;
      mod.webcamStatus = Sk.ffi.remapToPy(1);
      mod.webcamResponse = new Sk.builtin.str("WebCam not set up.");           
      throw "WebCam not set up."        
    }     
    try {     
      await tmImagePredict(canvas, topK);
    } catch (error) {
      mod.webcamWaiting = false;
      mod.webcamStatus = Sk.ffi.remapToPy(1);
      mod.webcamResponse = new Sk.builtin.str("Error with predicting from webcam.");      
      throw error;
    }
  });  

  async function tmImagePredict(src, topK) {
    try {
      const prediction = await mod.tmImageModel.predictTopK(src, topK);

      //let response = "";
      let response =[];
      for (let i = 0; i < topK; i++) {
        response.push([new Sk.builtin.str(prediction[i].className), new Sk.builtin.float_(prediction[i].probability.toFixed(2))]);
      }    
      mod.webcamResponse = Sk.ffi.remapToPy(response);
      mod.webcamWaiting = false;
    } catch (error) {
      throw error;
    }
  }
  
  

  //////////////////////////////////////////// Lanugages Mapping ////////////////////////////////////////////
   
  var languages = {
    'arabic':'ar-SA',
    'bangla':'bn-BD',
    'indian bangla':'bn-IN',
    'czech':'cs-CZ',
    'danish':'da-DK',
    'austrian german':'de-AT',
    'swiss german':'de-CH',
    'german':'de-DE',
    'greek':'el-GR',
    'english':'en-AU',
    'australian english':'en-AU',
    'canadian english':'en-CA',
    'british english':'en-GB',
    'irish english':'en-IE',
    'indian english':'en-IN',
    'new zeland english':'en-NZ',
    'american english':'en-US',
    'south african english':'en-ZA',
    'argentine spanish':'es-AR',
    'chilean spanish':'es-CL',
    'colombian spanish':'es-CO',
    'spanish':'es-ES',
    'mexican spanish':'es-MX',
    'american spanish':'es-US',
    'finnish':'fi-FI',
    'belgian french':'fr-BE',
    'canadian french':'fr-CA',
    'swiss french':'fr-CH',
    'french':'fr-FR',
    'hebrew':'he-IL',
    'hindi':'hi-IN',
    'hungarian':'hu-HU',
    'indonesian':'id-ID',
    'swiss italian':'it-CH',
    'italian':'it-IT',
    'japanese':'ja-JP',
    'korean':'ko-KR',
    'belgian dutch':'nl-BE',
    'dutch':'nl-NL',
    'norwegian':'no-NO',
    'polish':'pl-PL',
    'brazilian portugese':'pt-BR',
    'portugese':'pt-PT',
    'romanian':'ro-RO',
    'russian':'ru-RU',
    'slovak':'sk-SK',
    'swedish':'sv-SE',
    'tamil':'ta-IN',
    'sri lankan tamil':'ta-LK',
    'thai':'th-TH',
    'turkish':'tr-TR',
    'chinese':'zh-CN',
    'mandarin':'zh-CN',    
    'hong kong chinese':'zh-HK',
    'cantonese':'zh-HK',
    'taiwan chinese':'zh-TW',
    'taiwanese':'zh-TW',      
  };  

  return mod;
}

// test comment to make sure github set up properly