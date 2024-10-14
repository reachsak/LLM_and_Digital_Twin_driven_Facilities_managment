const sdk = require("microsoft-cognitiveservices-speech-sdk");

// Ensure environment variables are set correctly
const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.SPEECH_KEY || "5630d19384fc422f88c86b91e2354aee",
  process.env.SPEECH_REGION || "eastus"
);
speechConfig.speechRecognitionLanguage = "en-US";

function fromMicrophone() {
  // Configure the microphone input
  let audioConfig;
  try {
    audioConfig = AudioConfiguration.fromMicrophoneInput(
      "MacBook Pro Microphone"
    );
  } catch (err) {
    console.error(`Error accessing the microphone: ${err.message}`);
    return;
  }

  // Create a speech recognizer
  const speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  // Start continuous recognition
  speechRecognizer.recognizing = (s, e) => {
    console.log(`RECOGNIZING: Text=${e.result.text}`);
  };

  speechRecognizer.recognized = (s, e) => {
    if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
      console.log(`RECOGNIZED: Text=${e.result.text}`);
    } else if (e.result.reason === sdk.ResultReason.NoMatch) {
      console.log("NOMATCH: Speech could not be recognized.");
    }
  };

  speechRecognizer.canceled = (s, e) => {
    console.log(`CANCELED: Reason=${e.reason}`);

    if (e.reason === sdk.CancellationReason.Error) {
      console.log(`CANCELED: ErrorCode=${e.errorCode}`);
      console.log(`CANCELED: ErrorDetails=${e.errorDetails}`);
      console.log(
        "CANCELED: Did you set the speech resource key and region values?"
      );
    }
    speechRecognizer.stopContinuousRecognitionAsync();
  };

  speechRecognizer.sessionStopped = (s, e) => {
    console.log("\n    Session stopped event.");
    speechRecognizer.stopContinuousRecognitionAsync();
  };

  // Start continuous recognition
  speechRecognizer.startContinuousRecognitionAsync(
    () => {
      console.log("Listening for your voice. Press Ctrl+C to stop.");
    },
    (err) => {
      console.error(`Error starting continuous recognition: ${err.message}`);
      speechRecognizer.close();
    }
  );
}

fromMicrophone();
