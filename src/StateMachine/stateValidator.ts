import {CreateListingModel} from '../tests/stateMechanic.test';
import {StateConfig} from './model';

export class StateValidator {
    static validate(config: StateConfig<CreateListingModel>) {
        const keys = Object.keys(config);
        const stateNames = keys.map((key) => config[key].name);
        const uniqueStateNames = [...new Set(stateNames)];

        if (stateNames.length !== uniqueStateNames.length) {
            throw new Error('State names must be unique');
        }

        keys.forEach((key) => {
            const state = config[key];
            if (!state.validate) {
                // no op for now
            }
            else {
                state.validate = () => true;
            }
        })


        keys.forEach((key) => {
            const state = config[key];
            if (state.state) {
                // StateValidator.validate(state.state);
            }
        });
    }
}