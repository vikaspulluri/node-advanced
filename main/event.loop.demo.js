// node myFile.js

const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];

// First node run the contents written in the file
// New timers, tasks, operations are recorded from myFile running
myFile.runContents();

function shouldContinue() {
  // Check one: Any pending setTimeout, setInterval, setImmediate?
  // Check two: Any pending OS tasks?(may be server listening to http/port)
  // Check three: Any pending long running operations? (fs module)
  return pendingTimers.length || pendingOSTasks.length || pendingOperations.length;
}

// Entire body executes in one 'tick'
while(shouldContinue()) {
  // 1. Node looks at pendingTimers and sees if any functions are ready to be called. setTimeout, setInterval
  // 2. Node looks at pendingOSTasks and pendingOperations, calls relevant callbacks
  // 3. Pause execution. Continue when...
    // - a new pendingOSTasks is done
    // - a new pendingOperations is done
    // - a timer is about to continue
  // 4. Look at pendingTimers. setImmediate
  // 5. Handle any 'close' events
}



// exit back to terminal
