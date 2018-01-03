/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');
var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @returns array of validation errors, empty if no errors found
 *
 *
 */
function checkUfpTypes(typeSpecs, values, location, componentName) {
    var result = []
    for (var typeSpecName in typeSpecs) {
        if (typeSpecs.hasOwnProperty(typeSpecName)) {
            var error;
            // Prop type validation may throw. In case they do, we don't want to
            // fail the render phase where it didn't fail before. So we log it.
            // After these have been cleaned up, we'll let them throw.
            try {
                // This is intentionally an invariant that gets caught. It's the same
                // behavior as without this statement except with a better message.
                invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
                error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
            } catch (ex) {
                error = ex;
            }
            // warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);

            if (error instanceof Error) {
                // Only monitor this failure once because there tends to be a lot of the
                // same error.
                result.push(error.message)
                // warning(false, 'Failed %s type: %s%s', location, error.message, '');
            }
        }
    }
    return result
}

module.exports = checkUfpTypes;
