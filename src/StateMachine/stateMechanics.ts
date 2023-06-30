import fs from 'fs';
import util from 'util';

export type StateConfig = {
    [key: string]: State;
};

export interface State {
    name?: string;
    url?: string;
    state?: StateConfig;
    next?: State;
    previous?: State;
    display?: boolean | ((state: State, model: any) => boolean);
    validate?: (state:State, model: any) => boolean;
}

export class StateMechanics {
    public state: StateConfig;

    constructor(config: StateConfig) {
        this.state = this._buildState(config);
    }

    _buildState(config: StateConfig): StateConfig {
        const build = (
            config: StateConfig,
            parent?: State,
            nextParent?: State
        ): StateConfig => {
            const keys = Object.keys(config) as Array<string>;


            return keys.reduce((acc: StateConfig, cur: string, index: number) => {

                let previousState: State;
                let nextState: State;
                let childState: StateConfig;
                const currentState = config[cur];

                // if last item in array set next state to the next parent
                if (keys.length === index) {
                    nextState = nextParent;
                }

                // if start of array set previous state to the previous parent
                // and set next state to the next item in the array
                if (index === 0) {
                    previousState = parent;
                    nextState = nextState ?? config[keys[index + 1]];
                }
                // if state has children then set this state as the previous state for the child
                if (currentState.state) {
                    childState = build(
                        currentState.state,
                        currentState,
                        config[keys[index + 1]]
                    );
                    nextState = childState[Object.keys(childState)[0]];
                }
                
                // if no next state then set to the next state in the array
                if (!nextState) {
                    nextState = config[keys[index + 1]];
                    if (!nextState) {
                        nextState = nextParent;
                    }
                }

                // if no previous state then set to the previous state in the hierarchy
                if (!previousState) {
                    const cState =config[keys[index - 1] as string]
                    if(cState?.state)
                    {
                        const ks = Object.keys(cState.state) as Array<string>;
                        previousState = cState.state[ks[ks.length - 1]];

                    } else {
                        previousState = cState;
                    }
                }

                acc[cur].next = nextState;
                acc[cur].previous = previousState;


                return acc;
            }, config);
        };

        const conf = build(config);
        return conf;


    }
}


export const config: StateConfig = {
    type: {
        name: 'Create Listing',
        url: '/createListing/listing-type',
        state: {
            singleCard: {
                name: 'Single Card',
                url: '/createListing/single-card',
            },
            mixedBundle: {
                name: 'Mixed Bundle',
                url: '/createListing/mixed-bundle',
                state: {
                    title: {
                        name: 'Title',
                        url: '/createListing/mixed-bundle/title',
                    },
                    tagSelection: {
                        name: 'Tag Selection',
                        url: '/createListing/mixec-bundle/tag-selection',
                    },
                },
            },
            sealedSingle: {
                name: 'Sealed Single',
                url: '/createListing/sealed-single',
            },
        },
    },
};