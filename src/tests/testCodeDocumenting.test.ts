import {StateMechanic} from '../StateMachine/stateMechanic';
import vm from 'vm';
import util from 'util'
import fs from 'fs'
import assert from 'assert'
export interface CreateListingModel {
    type?: 'singleCard' | 'mixedBundle' | 'sealedSingle';
}

const readFile = util.promisify(fs.readFile);

describe('StateMechanic Class Comments', () => {
    let cls: Array<string> = [];

    beforeAll(async () => {
        const file = await readFile('./src/StateMachine/stateMechanic.ts', 'utf8'); // read the file
        const findDocumentation = /\`\`\`typescript([\s\S]+?)\`\`\`/gm; // find the documentation between MD code blocks - (all code between ```typescript and ````)
        const removeAsterisk = /\*/gm;
        const matches = file.match(findDocumentation);

        cls = matches?.map((match) => match.slice(13, -3)
            .replace(removeAsterisk, '') // remove all asterisk characters, risky if using asterisk in code blocks, but we don't
            .trim()) ?? []; 
    });

    it('Document Tests', () => {
        const sandbox = {
            StateMechanic: StateMechanic,
            console,
            require,
            assert
        };

        cls.forEach((c) => {
            vm.runInNewContext(c, {...sandbox});
        });
    })
})