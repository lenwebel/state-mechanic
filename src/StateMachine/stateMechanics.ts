import {collapseTextChangeRangesAcrossMultipleVersions} from 'typescript';
import {State, StateConfig} from './model';

export class StateMechanics<TValidationModel = any> {
    public model: TValidationModel;
    public readonly state: StateConfig<TValidationModel>;
    public selectedState: State;

    constructor(config: StateConfig<TValidationModel>) {
        this.state = this._buildState(config);
    }

    private getNextState(lengthOfArray: number, nextParent: State<TValidationModel>, nextStateInArray: State<TValidationModel>, arrayIndex: number): State<TValidationModel> {
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
    private getPreviousState(parent: State<TValidationModel>, previousStateInArray: State<TValidationModel>, arrayIndex: number): State<TValidationModel> {
        let previousState: State<TValidationModel> = previousStateInArray;
        // if start of array set previous state to the previous parent
        // and set next state to the next item in the array
        if (arrayIndex === 0) {
            previousState = parent;
        }

        // if previous state at this level as children then set the previous state to the last child
        // const pState = config[keys[index - 1] as string]
        if (previousStateInArray?.state) {
            const ks = Object.keys(previousStateInArray.state) as Array<string>;
            previousState = previousStateInArray.state[ks[ks.length - 1]];
        }


        return previousState;
    }

    _buildState(config: StateConfig<TValidationModel>): StateConfig<TValidationModel> {
        const build = (
            config: StateConfig<TValidationModel>,
            parent?: State<TValidationModel>,
            nextParent?: State<TValidationModel>
        ): StateConfig<TValidationModel> => {
            const keys = Object.keys(config) as Array<string>;
            return keys.reduce((acc: StateConfig<TValidationModel>, cur: string, index: number) => {




                let previousState: State<TValidationModel>;
                let nextState: State<TValidationModel>;
                let childState: StateConfig<TValidationModel>;
                const currentState = config[cur];

                // objects are passed by reference so if they are set we don't need to do anything
                if (currentState.next && currentState.previous)
                    return acc;



                nextState = config[keys[index + 1]];
                previousState = config[keys[index - 1]];

                nextState = this.getNextState(keys.length, nextParent, nextState, index);
                previousState = this.getPreviousState(parent, previousState, index);

                // if state has children then set this state as the previous state for the child
                if (currentState.state) {
                    childState = build(
                        currentState.state,
                        currentState,
                        config[keys[index + 1]]
                    );

                    nextState = childState[Object.keys(childState)[0]];
                }

                defineGetProperty(nextState, 'visible', () => nextState?.hide?.(nextState.model, nextState), nextState?.model);
                defineGetProperty(previousState, 'visible', () => previousState?.hide?.(previousState.model, previousState), previousState?.model);

                acc[cur].next = (model) => {
                    if (model !== undefined) {
                        this.model = model
                        nextState.model = this.model;
                    }
                    if (nextState?.visible === false) {
                        console.log('nextState?.visible', nextState)
                    }

                    return nextState
                };

                acc[cur].previous = (model) => {
                    if (model !== undefined) {
                        this.model = model
                        nextState.model = this.model;
                    }

                    if (previousState?.visible === false) {
                         previousState?.visible && console.log('previousState?.visible', previousState?.visible)
                    }

                    return previousState
                };


                return acc;
            }, config);
        };

        const conf = build(config);
        return conf;
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
