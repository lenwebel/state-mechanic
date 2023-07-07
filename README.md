# state-mechanic

And another state machine

## Install

`npm install state-mechanic`

## Usage

```javascript

import {StateConfig} from '../StateMachine/model';
import {StateMechanic} from '../StateMachine/stateMechanics';
import assert from 'assert';

export interface CreateListingModel {
    type?: 'singleCard' | 'mixedBundle' | 'sealedSingle';
}

export const config: StateConfig<CreateListingModel> = {
    type: {
        name: 'Create Listing',
        url: '/createListing/listing-type',
        state: {
            singleCard: {
                name: 'Single Card',
                url: '/createListing/single-card',
                validate: (model: CreateListingModel) => {
                    return model.type === 'singleCard';
                },
            },
            mixedBundle: {
                name: 'Mixed Bundle',
                url: '/createListing/mixed-bundle',
                state: {
                    title: {
                        name: 'Title',
                        url: '/createListing/mixed-bundle/title',
                        hide: (model?: CreateListingModel) => {
                            return ['singleCard', 'mixedBundle'].includes(model?.type);
                        },
                    },
                    tagSelection: {
                        name: 'Tag Selection',
                        url: '/createListing/mixec-bundle/tag-selection',
                        hide: (model?: CreateListingModel) => {
                            return ['singleCard', 'mixedBundle'].includes(model?.type);
                        },
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


const instance = new StateMechanic(config);
let state = instance.state.type;

state = state.next();
assert(state.name === 'Single Card', "should be single Card");
state = state.next();
assert(state.name === 'Mixed Bundle');
state = state.next();
assert(state.name === 'Title');
expect(1).toBe(1);


```
