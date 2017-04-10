/**
 * Wraps a custom error in a proper JS Error, but summarizes stack to 1 line
 */
function WrapError(error, errorFields) {

    const stack = error.stack;
    const stack1stLine = stack.split('\n', 2).join("\n"); //TODO

    return Object.assign(error, errorFields, {stack: stack1stLine+"\n"});
}

export default WrapError;
