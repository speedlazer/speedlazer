import when from "when";
import sequence from "when/sequence";
import parallel from "when/parallel";

//when.callbacks = require('../callbacks');
//when.cancelable = require('../cancelable');
//when.delay = require('../delay');
//when.fn = require('../function');
//when.guard = require('../guard');
//when.keys = require('../keys');
//when.nodefn = when.node = require('../node');
when.parallel = parallel;
//when.pipeline = require('../pipeline');
//when.poll = require('../poll');
when.sequence = sequence;
//when.timeout = require('../timeout');

export default when;
