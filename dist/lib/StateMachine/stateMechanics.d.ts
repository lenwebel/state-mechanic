import { InternalState, StateConfig, StateType } from './model';
export declare class StateMechanics<TValidationModel = any> {
    model: TValidationModel;
    readonly state: StateConfig<TValidationModel, InternalState<TValidationModel>>;
    selectedState: InternalState<TValidationModel>;
    constructor(config: StateConfig<TValidationModel, StateType>);
    private getNextState;
    private getPreviousState;
    _buildState(config: StateConfig<TValidationModel, InternalState<TValidationModel>>): StateConfig<TValidationModel, InternalState>;
    setCurrentState(state: InternalState<TValidationModel>): void;
    setModel(model: TValidationModel): void;
}
//# sourceMappingURL=stateMechanics.d.ts.map