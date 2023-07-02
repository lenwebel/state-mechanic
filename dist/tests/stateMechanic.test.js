"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const stateMechanics_1 = require("../StateMachine/stateMechanics");
exports.config = {
    type: {
        name: 'Create Listing',
        url: '/createListing/listing-type',
        state: {
            singleCard: {
                name: 'Single Card',
                url: '/createListing/single-card',
                validate: (model) => {
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
                        hide: (model) => {
                            return ['singleCard', 'mixedBundle'].includes(model === null || model === void 0 ? void 0 : model.type);
                        }
                    },
                    tagSelection: {
                        name: 'Tag Selection',
                        url: '/createListing/mixec-bundle/tag-selection',
                        hide: (model) => {
                            return ['singleCard', 'mixedBundle'].includes(model === null || model === void 0 ? void 0 : model.type);
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
        const instance = new stateMechanics_1.StateMechanics(exports.config);
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
        state = state.previous();
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
        const instance = new stateMechanics_1.StateMechanics(exports.config);
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
        state = state.previous();
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
        const instance = new stateMechanics_1.StateMechanics(exports.config);
        const model = {};
        let state = instance.state.type;
        expect(state.name).toBe('Create Listing');
        state = state.next(model);
        expect(state.name).toBe('Single Card');
        expect(state.validate(model, state)).toBe(false);
    });
    it('Validator: Single Card should return true if not selected', () => {
        const instance = new stateMechanics_1.StateMechanics(exports.config);
        let state = instance.state.type;
        expect(state.name).toBe('Create Listing');
        const model = { type: 'singleCard' };
        state = state.next(model);
        expect(state.name).toBe('Single Card');
        expect(state.validate(model, state)).toBe(true);
        expect(state.model).toEqual(model);
    });
});
describe('Preview next state should return the correct state', () => {
    it('preview next should return correct Single Card', () => {
        const instance = new stateMechanics_1.StateMechanics(exports.config);
        let state = instance.state.type;
        expect(state.name).toBe('Create Listing');
        expect(state.next().name).toBe('Single Card');
    });
    it('Preview previous state should return correct state', () => {
        const instance = new stateMechanics_1.StateMechanics(exports.config);
        let state = instance.state.type;
        expect(state.name).toBe('Create Listing');
        expect(state.next().previous().name).toBe('Create Listing');
    });
});
describe('Test Hide works', () => {
    it('Hide tag selection and Title if mixedBundle is not selected', () => {
        const instance = new stateMechanics_1.StateMechanics(exports.config);
        let state = instance.state.type;
        expect(state.name).toBe('Create Listing');
        state = state.next();
        expect(state.name).toBe('Single Card');
        state = state.next();
        expect(state.name).toBe('Mixed Bundle');
        state = state.next();
        expect(state.name).toBe('Title');
        const model = { type: 'singleCard' };
        // they actually should not be in the output.
        expect(state.hide(model)).toBe(true);
        expect(state.next().hide(model)).toBe(true);
    });
});
//# sourceMappingURL=stateMechanic.test.js.map