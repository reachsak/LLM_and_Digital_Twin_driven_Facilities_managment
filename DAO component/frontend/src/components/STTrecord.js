const fs = require("fs");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const { Microphone } = require("node-microphone");

// This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
const speechConfig = sdk.SpeechConfig.fromSubscription(
  "5630d19384fc422f88c86b91e2354aee",
  "eastus"
);
speechConfig.speechRecognitionLanguage = "en-US";

function fromMicrophone() {
  const audioConfig = sdk.AudioConfig.fromStreamInput(
    new Microphone({
      channels: 1, // Mono audio
      rate: 16000, // Sample rate (16 kHz)
      debug: false,
    })
  );

  const speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  setTimeout(() => {
    console.log("Recording stopped.");
    speechRecognizer.stopContinuousRecognitionAsync(() => {
      console.log("Continuous recognition stopped.");
    });
  }, 10000); // Stop recording after 10 seconds

  speechRecognizer.startContinuousRecognitionAsync(() => {
    console.log("Recognition started. Speaking now...");
  });

  speechRecognizer.recognizing = (s, e) => {
    console.log(`RECOGNIZING: Text=${e.result.text}`);
  };

  speechRecognizer.recognized = (s, e) => {
    if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
      console.log(`RECOGNIZED: Text=${e.result.text}`);
    } else {
      console.log(`RECOGNIZED: Reason=${e.result.reason}`);
    }
  };

  speechRecognizer.canceled = (s, e) => {
    console.log(`CANCELED: Reason=${e.reason}`);
    if (e.reason === sdk.CancellationReason.Error) {
      console.log(`CANCELED: ErrorCode=${e.errorCode}`);
      console.log(`CANCELED: ErrorDetails=${e.errorDetails}`);
    }
  };
}

fromMicrophone();
