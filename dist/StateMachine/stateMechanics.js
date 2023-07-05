"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateMechanics = void 0;
class StateMechanics {
    constructor(config) {
        this.state = this._buildState(config);
    }
    getNextState(lengthOfArray, nextParent, nextStateInArray, arrayIndex) {
        let nextState = nextStateInArray;
        // if last item in array set next state to the next parent
        if (lengthOfArray - 1 === arrayIndex) {
            nextState = nextParent;
        }
        // if start of array set previous state to the previous parent
        // and set next state to the next item in the array
        if (arrayIndex === 0) {
            nextState = nextState !== null && nextState !== void 0 ? nextState : nextStateInArray;
        }
        return nextState;
    }
    getPreviousState(parent, previousStateInArray, arrayIndex) {
        let previousState = previousStateInArray;
        // if start of array set previous state to the previous parent
        // and set next state to the next item in the array
        if (arrayIndex === 0) {
            previousState = parent;
        }
        // if previous state at this level as children then set the previous state to the last child
        // const pState = config[keys[index - 1] as string]
        if (previousStateInArray === null || previousStateInArray === void 0 ? void 0 : previousStateInArray.state) {
            const ks = Object.keys(previousStateInArray.state);
            previousState = previousStateInArray.state[ks[ks.length - 1]];
        }
        return previousState;
    }
    _buildState(config) {
        const build = (config, parent, nextParent) => {
            const keys = Object.keys(config);
            return keys.reduce((acc, cur, index) => {
                let previousState;
                let nextState;
                let childState;
                const currentState = config[cur];
                // objects are passed by reference so if they are set we don't need to do anything
                if (currentState.next && currentState.previous)
                    return acc;
                nextState = config[keys[index + 1]];
                previousState = config[keys[index - 1]];
                nextState = this.getNextState(keys.length, nextParent, nextState, index);
                previousState = this.getPreviousState(parent, previousState, index);
                // build child state
                if (currentState.state) {
                    childState = build(currentState.state, currentState, config[keys[index + 1]]);
                    nextState = childState[Object.keys(childState)[0]];
                }
                // typescript does not recognise optional getters
                defineGetProperty(nextState, 'visible', () => { var _a; return !((_a = nextState === null || nextState === void 0 ? void 0 : nextState.hide) === null || _a === void 0 ? void 0 : _a.call(nextState, nextState.model, nextState)); }, nextState === null || nextState === void 0 ? void 0 : nextState.model);
                defineGetProperty(previousState, 'visible', () => { var _a; return !((_a = previousState === null || previousState === void 0 ? void 0 : previousState.hide) === null || _a === void 0 ? void 0 : _a.call(previousState, previousState.model, previousState)); }, previousState === null || previousState === void 0 ? void 0 : previousState.model);
                acc[cur].next = (model) => {
                    if (model !== undefined) {
                        this.model = model;
                        nextState.model = this.model;
                    }
                    if ((nextState === null || nextState === void 0 ? void 0 : nextState.visible) === false) {
                        return nextState.next(model);
                    }
                    return nextState;
                };
                acc[cur].previous = (model) => {
                    if (model !== undefined) {
                        this.model = model;
                        previousState.model = this.model;
                    }
                    if ((previousState === null || previousState === void 0 ? void 0 : previousState.visible) === false) {
                        return previousState.previous(model);
                    }
                    return previousState;
                };
                return acc;
            }, config);
        };
        const conf = build(config);
        return conf;
    }
    setModel(model) {
        /// updating the model, not sure if this affects the state model references.
        this.model = model;
    }
}
exports.StateMechanics = StateMechanics;
function defineGetProperty(object, property, fnc, model) {
    if (!object)
        return;
    if (object.hasOwnProperty(property))
        delete object[property];
    Object.defineProperty(object, property, {
        get() {
            return fnc === null || fnc === void 0 ? void 0 : fnc(model);
        },
        configurable: true,
    });
}
//# sourceMappingURL=stateMechanics.js.map