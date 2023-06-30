# state-mechanic

And another state machine

## Install

`npm install state-mechanic`

## Usage

```javascript
import { StateMachine } from 'state-mechanic';
import assert from 'assert';

// the config below is a simple example of a state machine that can be used to follow a create listing flow in a marketplace
export const config: StateConfig = {
    type: {
        name: 'Create Listing',
        url: '/createListing/listing-type',
        state: {
            singleCard: {
                name: 'Single listing',
                url: '/createListing/single-listing',
            },
            mixedListing: {
                name: 'Mixed listing',
                url: '/createListing/mixed-listing',
                state: {
                    title: {
                        name: 'Title',
                        url: '/createListing/mixed-listing/title',
                    },
                    tagSelection: {
                        name: 'Tag Selection',
                        url: '/createListing/mixed-listing/tag-selection',
                    },
                },
            },
            sealedListing: {
                name: 'Sealed Listing',
                url: '/createListing/sealed-single',
            },
        },
    },
};

const stateMachine = new StateMachine(config);

let state = stateMachine.next();



assert(state.name === 'Create Listing');
state = state.next;
assert(state.name === 'Single listing');
state = state.next;
assert(state.name === 'Mixed Bundle');
state = state.next;
assert(state.name === 'Title');

```
