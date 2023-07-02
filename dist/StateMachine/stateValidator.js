"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export class StateValidator {
//     static validate(config: StateConfig) {
//         const keys = Object.keys(config);
//         const stateNames = keys.map((key) => config[key].name);
//         const uniqueStateNames = [...new Set(stateNames)];
//         if (stateNames.length !== uniqueStateNames.length) {
//             throw new Error('State names must be unique');
//         }
//         keys.forEach((key) => {
//             const state = config[key];
//             if (state.validate) {
//                 state.validate = (model, state) => state.validate.call(state, model)
//             }
//             else {
//                 state.validate = () => true;
//             }
//         })
//         keys.forEach((key) => {
//             const state = config[key];
//             if (state.state) {
//                 StateValidator.validate(state.state);
//             }
//         });
//     }
// }
//# sourceMappingURL=stateValidator.js.map