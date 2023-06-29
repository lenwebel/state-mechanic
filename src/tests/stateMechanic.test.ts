
import {StateConfig, StateMechanics, config} from '../StateMachine/stateMechanics'

describe('', () => {
    it("should create a new state navigator instance with previous and next states", () => {
        const instance = new StateMechanics<StateConfig>(config);
        expect(instance).toBeDefined();

        expect(instance.state.type.name).toBe('Create Listing');
        expect(instance.state.type.next).toBeDefined();
        expect(instance.state.type.next.name).toBe('Single Card');
        expect(instance.state.type.next.next).toBeDefined();
        expect(instance.state.type.next.next.name).toBe('Mixed Bundle');

        expect(instance.state.type.next.next.next).toBeDefined();
        expect(instance.state.type.next.next.next.name).toBe('Title');
        expect(instance.state.type.next.next.next.next).toBeDefined();
        expect(instance.state.type.next.next.next.next.name).toBe('Tag Selection');
        expect(instance.state.type.next.next.next.next.next).toBeDefined();
        expect(instance.state.type.next.next.next.next.next.name).toBe('Sealed Single');
        expect(instance.state.type.next.next.next.next.next.next).toBeUndefined();
        expect(instance.state.type.next.next.next.next.next.previous).toBeDefined();
        expect(instance.state.type.next.next.next.next.next.previous.name).toBe('Create Listing');

        // expect(instance.state.type.next.next.next.next.next.previous.name).toBe('Tag Selection');




    })
})