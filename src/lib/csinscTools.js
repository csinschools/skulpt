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
    
    mod.sendsms = new Sk.builtin.func((number, message) => {
        var data = "number="+ number + "&msg=" + message;

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
             if (this.readyState === 4) {
                console.log(this.responseText);
             }
        });

        xhr.open("GET", "https://csinsc-codestore.azurewebsites.net/sendtext?" + data);
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.withCredentials = false;
        xhr.send(data);        
    });
    
    var synth = window.speechSynthesis;
    var voices = [];
    
    function populateVoiceList() {
      voices = synth.getVoices();
    }    
    
    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }
    
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
      if (voice >= voices.length) {
          voice = 0;
        } 
      utterThis.voice = voices[voice];
      utterThis.pitch = 1;
      utterThis.rate = 1;
      synth.speak(utterThis);        
      
      return new Sk.builtin.none;       
    });

    mod.startListen = new Sk.builtin.func(() => {
      const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
      const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

      mod.recognition = new SpeechRecognition();

      mod.listening = true;
      mod.final_transcript = "";
      mod.interim_transcript = "";
      mod.recognition.continuous = false;
      mod.recognition.lang = 'en-AU';
      mod.recognition.interimResults = true;
      mod.recognition.maxAlternatives = 1;

      mod.recognition.onresult = function(event) {
        mod.interim_transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            mod.final_transcript += event.results[i][0].transcript;
          } else {
            mod.interim_transcript += event.results[i][0].transcript;
          }
        }
      }

      mod.recognition.onspeechend = function() {
        mod.listening = false;
      } 
      
      mod.recognition.onsoundend = function() {
        mod.listening = false;
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
      mod.recognition.stop();
      mod.listening = false;
      return text  
    });
    
    return mod;
}

// test comment to make sure github set up properly