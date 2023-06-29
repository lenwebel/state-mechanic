import fs from 'fs';
import util from 'util';

export type StateConfig<TModel = any> = {
    [key in keyof TModel]: State<TModel>;
};


export interface State<TState = any> {
    name?: string;
    url?: string;
    state?: StateConfig<TState>;
    next?: State;
    previous?: State;
}


export class StateMechanics<TModel = any> {
    public state: StateConfig<TModel>;

    constructor(config: StateConfig<TModel>) {
        this.state = this._buildState(config);
    }

    _buildState(config: StateConfig<TModel>): StateConfig<TModel> {
        const build = (
            config: StateConfig<TModel>,
            parent?: State,
            nextParent?: State
        ): StateConfig<TModel> => {
            const keys = Object.keys(config) as Array<keyof TModel>;


            return keys.reduce((acc: StateConfig<TModel>, cur: keyof TModel, index: number) => {

                let previousState: State;
                let nextState: State;
                let childState: StateConfig;
                const currentState = config[cur];



                if (keys.length === index) {
                    // if last item in array set next state to the next parent
                    previousState = config[keys[index - 1]];
                    nextState = nextParent;
                }

                if (index === 0) {
                    // if start of array set previous state to the previous parent
                    previousState = parent;
                    nextState = nextState ?? config[keys[index + 1]];

                }
                if (currentState.state) {
                    // if state has children then set this state as the previous state for the child
                    childState = build(
                        currentState.state,
                        currentState,
                        config[keys[index + 1]]
                    );
                    nextState = childState[Object.keys(childState)[0]];
                }
                if (!nextState) {
                    nextState = config[keys[index + 1]];
                    if (!nextState) {
                        nextState = nextParent;
                    }
                }

                if (!previousState) {
                    previousState = parent;
                }

                acc[cur].next = nextState;
                acc[cur].previous = previousState;


                return acc;
            }, config);
        };

        const conf = build(config);
        fs.writeFileSync(
            './dist/stateMechanics.txt',
            util.inspect(conf, {showHidden: false, depth: 50}),
        );
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