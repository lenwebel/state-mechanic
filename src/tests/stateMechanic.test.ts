import {
    StateConfig,
    StateMechanics,
    config,
} from '../StateMachine/stateMechanics';
import util from 'util';
import fs from 'fs';

describe('', () => {
    it('should create a new state navigator instance with previous and next states', () => {
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
        expect(instance.state.type.next.next.next.next.next.name).toBe(
            'Sealed Single'
        );
        expect(instance.state.type.next.next.next.next.next.next).toBeUndefined();
        expect(instance.state.type.next.next.next.next.next.previous).toBeDefined();
        expect(instance.state.type.next.next.next.next.next.previous.name).toBe(
            'Tag Selection'
        );

    }),
        it('The readme example works', () => {
            const instance = new StateMechanics<StateConfig>(config);
            let state = instance.state.type;
            expect(state.name).toBe('Create Listing');
            state = state.next;

            let serialized = util.inspect(instance, {
                showHidden: false,
                depth: 50,
                
            });

            //write out file for debugging
            const regex = /(<.*>(?=\s{)|(\w.*)(?=:)(?<!"))(:|)/gm;
            serialized = '{' + serialized.replace(regex, '"$1":').replace(/'/gm, '"') + '}';
            // fs.writeFileSync('./dist/stateMechanics.json', serialized);
            


            expect(state.name).toBe('Single Card');
            state = state.next;
            expect(state.name).toBe('Mixed Bundle');
            state = state.next;
            expect(state.name).toBe('Title');
            state = state.next;
            expect(state.name).toBe('Tag Selection');
            state = state.next;
            expect(state.name).toBe('Sealed Single');
            state = state.previous
            expect(state.name).toBe('Tag Selection');
            state = state.previous;
            expect(state.name).toBe('Title');
            state = state.previous;
            expect(state.name).toBe('Mixed Bundle');
            state = state.previous;
            expect(state.name).toBe('Single Card');
            state = state.previous;
            expect(state.name).toBe('Create Listing');

        });
});
