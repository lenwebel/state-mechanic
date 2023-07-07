

import {InternalState, StateConfig, StateType} from './model';

export class StateMechanic<TValidationModel> {
    public model: TValidationModel;
    public readonly state: StateConfig<TValidationModel, InternalState<TValidationModel>>;
    public selectedState: InternalState<TValidationModel>;
    public thing: keyof StateConfig<TValidationModel>;

    constructor(config: StateConfig<TValidationModel, StateType>) {
        this.state = this._buildState(config as StateConfig<TValidationModel, InternalState<TValidationModel>>);
        this.selectedState = this.state[Object.keys(this.state)[0]];
    }

    /**
     * Internal Method: Treebuilder Next, a helper method to locate the next state.
     * @param lengthOfArray 
     * @param nextParent 
     * @param nextStateInArray 
     * @param arrayIndex 
     * @returns 
     */
    private getNextState(lengthOfArray: number, nextParent: InternalState<TValidationModel>, nextStateInArray: InternalState<TValidationModel>, arrayIndex: number): InternalState<TValidationModel> {
        let nextState = nextStateInArray;
        // if last item in array set next state to the next parent
        if (lengthOfArray - 1 === arrayIndex) {
            nextState = nextParent;
        }
        // if start of array set previous state to the previous parent
        // and set next state to the next item in the array
        if (arrayIndex === 0) {
            nextState = nextState ?? nextStateInArray;
        }

        return nextState;
    }

    /**
     * Internal Method: Treebuilder Previous, a helper method to locate the previous state.
     * @param parent 
     * @param previousStateInArray 
     * @param arrayIndex 
     * @returns 
     */
    private getPreviousState(parent: InternalState<TValidationModel>, previousStateInArray: InternalState<TValidationModel>, arrayIndex: number): InternalState<TValidationModel> {
        let previousState: InternalState<TValidationModel> = previousStateInArray;
        // if start of array set previous state to the previous parent
        // and set next state to the next item in the array
        if (arrayIndex === 0) {
            previousState = parent;
        }

        // if previous state at this level as children then set the previous state to the last child
        // const pState = config[keys[index - 1] as string]
        if (previousStateInArray?.state) {
            const ks = Object.keys(previousStateInArray.state) as Array<string>;
            previousState = previousStateInArray.state[ks[ks.length - 1]] as InternalState<TValidationModel>;
        }

        return previousState;
    }

    /**
     * Internal method: to build the state object by reference populating the next and previous properties of InternalState objects
     * @param config 
     * @returns 
     */
    private _buildState(config: StateConfig<TValidationModel, InternalState<TValidationModel>>): StateConfig<TValidationModel, InternalState> {
        const build = (
            config: StateConfig<TValidationModel, InternalState<TValidationModel>>,
            parent?: InternalState<TValidationModel>,
            nextParent?: InternalState<TValidationModel>
        ): StateConfig<TValidationModel, InternalState<TValidationModel>> => {


            const keys = Object.keys(config) as Array<string>;
            return keys.reduce((acc: StateConfig<TValidationModel, InternalState<TValidationModel>>, cur: string, index: number) => {

                let previousState: InternalState<TValidationModel>;
                let nextState: InternalState<TValidationModel>;
                let childState: StateConfig<TValidationModel, InternalState<TValidationModel>>;
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
                    childState = build(
                        currentState.state as StateConfig<TValidationModel, InternalState<TValidationModel>>,
                        currentState,
                        config[keys[index + 1]]
                    );
                    nextState = childState[Object.keys(childState)[0]];
                }
                // typescript does not recognise optional getters
                defineGetProperty(nextState, 'visible', () => !nextState?.hide?.(nextState.model, nextState), nextState?.model);
                defineGetProperty(previousState, 'visible', () => !previousState?.hide?.(previousState.model, previousState), previousState?.model);

                acc[cur].next = (model) => {

                    if (model !== undefined) {
                        this.model = model
                        nextState.model = this.model;
                    }

                    if (nextState?.visible === false) {
                        return nextState.next(model);
                    }

                    return nextState
                };

                acc[cur].previous = (model) => {
                    if (model !== undefined) {
                        this.model = model
                        previousState.model = this.model;
                    }

                    if (previousState?.visible === false) {
                        return previousState.previous(model);
                    }

                    return previousState
                };


                return acc;
            }, config);
        };

        const conf = build(config);
        return conf;
    }
    /**
     * Internal method: to set the selected state and update the model if required
     * @param state 
     * @param model 
     */
    private setState(state: InternalState<TValidationModel>, model?: TValidationModel): void {
        this.selectedState = state;
        this.setModel(model);
    }

    /**
     * set the selected state to the next state after the current state, if the current state has a child state then the child state will be selected
     * @param model update the model if required when moving to the next state
     * @example 
     * ```typescript
     * const state = new StateMechanic({state1: {name: 'state1', state: {test: {name: 'child'}}}});
     * state.moveNext();
     * assert(state.selectedState.name === 'child','state should be... child - moveMoveNext' );
     * ```
     */
    public moveNext(model?: TValidationModel): void {
        this.selectedState = this.selectedState.next(model);
    }

    /**
     * set the selected state to the previous state before the current state, if the previous state has a child state and that state has child state right down to the bottom of the tree, 
     * then the last child state will be selected
     * @param model update the model if required when moving to the next state
     * @example
     * ```typescript
     * const state = new StateMechanic({state1: {name: 'state1', state: {test: {name: 'child'}}}});
     * state.moveNext();
     * assert(state.selectedState.name === 'child','state should be... child - movePrevious ');
     * state.movePrevious();
     * assert(state.selectedState.name === 'state1','state should be... test - moveMovePrevious ');
     * ```
     * 
     */
    public movePrevious(model?: TValidationModel): void {
        this.selectedState = this.selectedState.previous();
    }

    /**
     * sets the selected state to the first occurance of the state name found in the state config
     * @param propertyName the name of the state to find
     * @returns the state found
     * @example
     * ```typescript
     * const state = new StateMechanic({state1: {name: 'state1', state: {test: {name: 'child'}}}});
     * state.gotoState('test');
     * assert(state.selectedState.name === 'child','state should be... child - gotoState ' );
     * ```
     */
    public gotoState(propertyName: keyof StateConfig<TValidationModel, InternalState<TValidationModel>>, model?: TValidationModel): void {

        const findState = (states: StateConfig<TValidationModel, InternalState<TValidationModel>>): InternalState<TValidationModel> => {
            const keys = Object.keys(states) as Array<string>;
            const found = keys.find((key) => key === propertyName.toString());

            if (found) {
                return states[found];
            }

            return keys.reduce((acc: InternalState<TValidationModel>, cur: string) => {
                if (acc) return acc;
                if (states[cur].state) {
                    return findState(states[cur].state as StateConfig<TValidationModel, InternalState<TValidationModel>>);
                }
                return acc;
            }, undefined);
        }

        if (!this.selectedState)
            console.warn(`state "${propertyName.toString()}" not found`)

        this.setState(findState(this.state));
        this.setModel(model);
    }

    /**
     * setState updates the state model which is passed to the internal hide, validate and action functions.
     * @param model sets the model for the state machine
     * @example
     * ```typescript
     * const state = new StateMechanic({state1: {name: 'state1', state: {test: {name: 'child'}}}});     
     * state.setModel({name: 'test'});
     * assert(state.model.name === 'test','state should be... child - setModel ' );
     * ```
     * 
     */
    public setModel(model: TValidationModel): void {
        this.model = model;
    }
}

function defineGetProperty<T>(object: T, property: keyof T, fnc: Function, model: any) {
    if (!object) return;

    if (object.hasOwnProperty(property))
        delete object[property];

    Object.defineProperty(object, property, {
        get() {
            return fnc?.(model);
        },
        configurable: true,
    });
}
