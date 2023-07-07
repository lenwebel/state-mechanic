
import {State, StateConfig} from '../StateMachine/model';
import {StateMechanics} from '../StateMachine/stateMechanics';

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
        const instance = new StateMechanics(config);
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

    it('The readme example works', () => {
        const instance = new StateMechanics(config);
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
        const instance = new StateMechanics(config);
        const model = {};
        let state = instance.state.type;
        expect(state.name).toBe('Create Listing');
        state = state.next(model);
        expect(state.name).toBe('Single Card');
        expect(state.validate?.(model, state)).toBe(false);
    })
    it('Validator: Single Card should return true if not selected', () => {
        const instance = new StateMechanics(config);
        let state = instance.state.type;
        expect(state.name).toBe('Create Listing');
        const model = {type: 'singleCard'} as CreateListingModel;
        state = state.next(model);
        expect(state.name).toBe('Single Card');
        expect(state.validate?.(model, state)).toBe(true);
        expect(state.model).toEqual(model);
    })
})

describe('Preview next state should return the correct state', () => {
    it('preview next should return correct Single Card', () => {
        const instance = new StateMechanics(config);
        let state = instance.state.type;
        expect(state.name).toBe('Create Listing');
        expect(state.next().name).toBe('Single Card');


    })
    it('Preview previous state should return correct state', () => {
        const instance = new StateMechanics(config);
        let state = instance.state.type;
        expect(state.name).toBe('Create Listing');
        expect(state.next().previous().name).toBe('Create Listing');
    })
})

describe('Test Hide works', () => {
    it('Hide tag selection and Title if mixedBundle is not selected', () => {
        const instance = new StateMechanics(config);
        let state = instance.state.type;
        expect(state.name).toBe('Create Listing');
        state = state.next();
        expect(state.name).toBe('Single Card');
        state = state.next();
        expect(state.name).toBe('Mixed Bundle');
        state = state.next();
        expect(state.name).toBe('Title');
        const model = {type: 'singleCard'} as CreateListingModel;

        expect(state.hide?.(model)).toBe(true);
        expect(state.next().hide?.(model)).toBe(true);

    })

    
    describe('Test SelectedState', () => {
        const instance = new StateMechanics(config);
        console.log(instance.selectedState.name)

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

    describe ('Test goto state', () => {
        const instance = new StateMechanics<CreateListingModel>(config);
        instance.selectState('Single Card');
        expect(instance.selectedState.name).toBe('Single Card');
        instance.selectState('Mixed Bundle');
        expect(instance.selectedState.name).toBe('Mixed Bundle');
        instance.selectState('Title');
        expect(instance.selectedState.name).toBe('Title');
        instance.selectState('Tag Selection');
        expect(instance.selectedState.name).toBe('Tag Selection');
        instance.selectState('Sealed Single');
        expect(instance.selectedState.name).toBe('Sealed Single');
    })

})


