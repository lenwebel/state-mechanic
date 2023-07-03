import { State, StateConfig } from './model';
export declare class StateMechanics<TValidationModel = any> {
    model: TValidationModel;
    readonly state: StateConfig<TValidationModel>;
    selectedState: State;
    constructor(config: StateConfig<TValidationModel>);
    private getNextState;
    private getPreviousState;
    _buildState(config: StateConfig<TValidationModel>): StateConfig<TValidationModel>;
}
//# sourceMappingURL=stateMechanics.d.ts.map