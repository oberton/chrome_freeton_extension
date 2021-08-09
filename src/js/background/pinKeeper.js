import eventBus from 'js/utils/utils/eventBus';

let myPin;

function onPinSuccess(pin) {
  myPin = pin;
}

function onAskForPin() {
  if (myPin) {
    setTimeout(() => {
      eventBus.trigger('set-pin-from-bg', myPin);
    });
  }
}

eventBus
  .on('ask-for-pin', onAskForPin)
  .on('pin-success', onPinSuccess);
