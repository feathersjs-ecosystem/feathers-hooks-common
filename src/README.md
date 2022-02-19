Hook standards for written values so they work on all adapters
- {Number} boolean: 0,1
- {Number | null} date: null or Unix data (Date.now())
- {String} arrays: JSON.stringify(array)
- {Object} params for called service: default is callingParams()(context)