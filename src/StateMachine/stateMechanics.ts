
import { InternalState,StateConfig, StateType} from './model';


export class StateMechanics<TValidationModel = any> {
    public model: TValidationModel;
    public readonly state: StateConfig<TValidationModel, InternalState<TValidationModel>>;
    public selectedState: ReadyState;

    constructor(config: StateConfig<TValidationModel, StateType>) {
        this.state = this._buildState(config as StateConfig<TValidationModel, InternalState<TValidationModel>>);
    }

    private getNextState(lengthOfArray: number, nextParent:InternalState<TValidationModel>, nextStateInArray:InternalState<TValidationModel>, arrayIndex: number):InternalState<TValidationModel> {
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
    private getPreviousState(parent:InternalState<TValidationModel>, previousStateInArray:InternalState<TValidationModel>, arrayIndex: number):InternalState<TValidationModel> {
        let previousState:InternalState<TValidationModel> = previousStateInArray;
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

    _buildState(config: StateConfig<TValidationModel, InternalState<TValidationModel>>): StateConfig<TValidationModel, InternalState> {
        const build = (
            config: StateConfig<TValidationModel, InternalState<TValidationModel> >,
            parent?: InternalState<TValidationModel>,
            nextParent?:InternalState<TValidationModel>
        ): StateConfig<TValidationModel, InternalState<TValidationModel>> => {


            const keys = Object.keys(config) as Array<string>;
            return keys.reduce((acc: StateConfig<TValidationModel, InternalState<TValidationModel>>, cur: string, index: number) => {

                let previousState: InternalState<TValidationModel>;
                let nextState:InternalState<TValidationModel>;
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
                        currentState.state as StateConfig<TValidationModel, InternalState<TValidationModel>> ,
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
