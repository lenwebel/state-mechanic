
import {InternalState, StateConfig} from '../StateMachine/model';
import {StateMechanic} from '../StateMachine/stateMechanic';


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
                            // console.log('model',model)
                            return ['singleCard', 'mixedBundle'].includes(model?.type ?? '');
                        }
                    },
                    tagSelection: {
                        name: 'Tag Selection',
                        url: '/createListing/mixec-bundle/tag-selection',
                        hide: (model?: CreateListingModel) => {
                            return ['singleCard', 'mixedBundle'].includes(model?.type ?? '');
                        }
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

describe('Check hierarchy next and previous functions', () => {
    it('should create a new state navigator instance with previous and next states', () => {
        const instance = new StateMechanic(config);
        let state = instance.state.type;

        expect(instance.model).toBeUndefined();
        expect(state.name).toBe('Create Listing');
        state = state.next();
        expect(state.name).toBe('Single Card');
        state = state.next();
        expect(state.name).toBe('Mixed Bundle');
        state = state.next();
        expect(state.name).toBe('Title');
        state = state.next();
        expect(state.name).toBe('Tag Selection');
        state = state.next();
        expect(state.name).toBe('Sealed Single');
        state = state.previous()
        expect(state.name).toBe('Tag Selection');
        state = state.previous();
        expect(state.name).toBe('Title');
        state = state.previous();
        expect(state.name).toBe('Mixed Bundle');
        state = state.previous();
        expect(state.name).toBe('Single Card');
        state = state.previous();
        expect(state.name).toBe('Create Listing');
    });

    it('The readme example works', () => {
        const instance = new StateMechanic(config);
        let state = instance.state.type;
        expect(state.name).toBe('Create Listing');
        state = state.next();
        expect(state.name).toBe('Single Card');
        state = state.next();
        expect(state.name).toBe('Mixed Bundle');
        state = state.next();
        expect(state.name).toBe('Title');
        state = state.next();
        expect(state.name).toBe('Tag Selection');
        state = state.next();
        expect(state.name).toBe('Sealed Single');
        state = state.previous()
        expect(state.name).toBe('Tag Selection');
        state = state.previous();
        expect(state.name).toBe('Title');
        state = state.previous();
        expect(state.name).toBe('Mixed Bundle');
        state = state.previous();
        expect(state.name).toBe('Single Card');
        state = state.previous();
        expect(state.name).toBe('Create Listing');
    });
});

describe('check validation functions work', () => {
    it('Validator: Single Card should return false if not selected', () => {
        const instance = new StateMechanic(config);
        const model = {};
        let state = instance.state.type;
        expect(state.name).toBe('Create Listing');
        instance.setModel(model);
        state = state.next();
        expect(state.name).toBe('Single Card');
        expect(state.validate?.(model, state)).toBe(false);
    })
    it('Validator: Single Card should return true if not selected', () => {
        const instance = new StateMechanic(config);
        let state = instance.state.type;
        expect(state.name).toBe('Create Listing');
        const model = {type: 'singleCard'} as CreateListingModel;
        state = state.next();
        expect(state.name).toBe('Single Card');
        expect(state.validate?.(model, state)).toBe(true);
        // expect(state.model).toEqual(model);
    })
})

describe('Preview next state should return the correct state', () => {
    it('preview next should return correct Single Card', () => {
        const instance = new StateMechanic(config);
        let state = instance.state.type;
        expect(state.name).toBe('Create Listing');
        expect(state.next().name).toBe('Single Card');


    })
    it('Preview previous state should return correct state', () => {
        const instance = new StateMechanic(config);
        let state = instance.state.type;
        expect(state.name).toBe('Create Listing');
        expect(state.next().previous().name).toBe('Create Listing');
    })
})

describe('Test Hide works', () => {
    let state: InternalState<CreateListingModel>;
    let instance: StateMechanic<CreateListingModel>;

    beforeEach(() => {
        instance = new StateMechanic(config);
        state = instance.state.type;
    });

    it('Hide tag selection and Title if mixedBundle is not selected', () => {

        expect(state.name).toBe('Create Listing');
        state = state.next();
        expect(state.name).toBe('Single Card');
        state = state.next();
        expect(state.name).toBe('Mixed Bundle');

        
        const model = {type: 'singleCard'} as CreateListingModel;
        instance.setModel(model);
        expect(instance.model).toEqual(model);
        expect(instance.model.type).toBe('singleCard');
        expect(state.name).toBe('Mixed Bundle');
        
        state = state.next();
        expect(state.name).toEqual('Sealed Single');
        
        instance.moveNext(); 
        expect(instance.selectedState.name).toEqual('Single Card');
        instance.moveNext(); // set selected state to mixed bundle
        expect(instance.selectedState.name).toEqual('Mixed Bundle');
        instance.moveNext(); // TRY set selected state to title
        expect(instance.selectedState.name).toEqual('Sealed Single');
    })



    it('Test SelectedState', () => {
        const instance = new StateMechanic(config);

        expect(instance.selectedState).toBe(instance.state.type);
        instance.moveNext();
        expect(instance.selectedState).toBe(instance.state.type.next());

        instance.moveNext();
        expect(instance.selectedState).toBe(instance.state.type.next().next());

        instance.movePrevious()
        expect(instance.selectedState).toBe(instance.state.type.next());

        instance.movePrevious()
        expect(instance.selectedState).toBe(instance.state.type);
    })


    it('Test goto state', () => {
        const instance = new StateMechanic<CreateListingModel>(config);
        instance.gotoState('type');
        expect(instance.selectedState).toBeDefined();
        expect(instance.selectedState.name).toBe('Create Listing');
        instance.gotoState('mixedBundle');
        expect(instance.selectedState).toBeDefined();
        expect(instance.selectedState.name).toBe('Mixed Bundle');
        instance.gotoState('title');
        expect(instance.selectedState).toBeDefined();
        expect(instance.selectedState.name).toBe('Title');
        instance.gotoState('tagSelection');
        expect(instance.selectedState).toBeDefined();
        expect(instance.selectedState.name).toBe('Tag Selection');
        instance.gotoState('sealedSingle');
        expect(instance.selectedState).toBeDefined();
        expect(instance.selectedState.name).toBe('Sealed Single');
    })

})

describe('Test state property names', () => {
    it('should return the correct number of state property names', () => {
        const instance = new StateMechanic(config);
        expect(instance.stateKeys().length).toBe(1);
        expect(instance.stateKeys(instance.state.type).length).toBe(6);

    })
})

describe('Test goto no propertyName error', () => {
    it('if a property name has not been provided return a list of valid property names', () => {
        const instance = new StateMechanic(config);

        expect(() => instance.gotoState('')).toThrowError('No propertyName provided. Valid property names are: type, singleCard, mixedBundle, sealedSingle, title, tagSelection')
    })
})


