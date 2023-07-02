"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const stateMechanics_1 = require("../StateMachine/stateMechanics");
const assert_1 = __importDefault(require("assert"));
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
                        },
                    },
                    tagSelection: {
                        name: 'Tag Selection',
                        url: '/createListing/mixec-bundle/tag-selection',
                        hide: (model) => {
                            return ['singleCard', 'mixedBundle'].includes(model === null || model === void 0 ? void 0 : model.type);
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
    const instance = new stateMechanics_1.StateMechanics(exports.config);
    let state = instance.state.type;
    it('should create a new state navigator instance with previous and next states', () => {
        state = state.next();
        (0, assert_1.default)(state.name === 'Single Card', "should be single Card");
        state = state.next();
        (0, assert_1.default)(state.name === 'Mixed Bundle');
        state = state.next();
        (0, assert_1.default)(state.name === 'Title');
        expect(1).toBe(1);
    });
});
//# sourceMappingURL=readme.test.js.map