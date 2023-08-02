import {InternalState, State, StateConfig} from '../StateMachine/model';
import {StateMechanic} from '../StateMachine/stateMechanic';
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
                            return ['singleCard', 'mixedBundle'].includes(model?.type ?? '');
                        },
                    },
                    tagSelection: {
                        name: 'Tag Selection',
                        url: '/createListing/mixec-bundle/tag-selection',
                        hide: (model?: CreateListingModel) => {
                            return ['singleCard', 'mixedBundle'].includes(model?.type ?? '');
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

describe('Double check readme file', () => {
    let state: InternalState<CreateListingModel>;
    let instance: StateMechanic<CreateListingModel>;
    beforeEach(() => {
        instance = new StateMechanic(config);
        state = instance.state.type;
    });

    it('should create a new state navigator instance with previous and next states', () => {

        expect(instance.model).toBeUndefined();
        state = state.next();
        expect(state.name).toBe('Single Card');
        state = state.next();
        expect(state.name).toBe('Mixed Bundle');
        state = state.next();
        expect(state.name).toBe('Title');
    })

    it('selected state should be set to the first state', () => {

        expect(instance.selectedState.name).toBe('Create Listing');
        instance.moveNext();
        expect(instance.selectedState.name).toBe('Single Card');

    });
});