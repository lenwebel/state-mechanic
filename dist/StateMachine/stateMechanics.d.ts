import { InternalState, StateConfig, StateType } from './model';
export declare class StateMechanics<TValidationModel = any> {
    model: TValidationModel;
    readonly state: StateConfig<TValidationModel, InternalState<TValidationModel>>;
    selectedState: ReadyState;
    constructor(config: StateConfig<TValidationModel, StateType>);
    private getNextState;
    private getPreviousState;
    _buildState(config: StateConfig<TValidationModel, InternalState<TValidationModel>>): StateConfig<TValidationModel, InternalState>;
    setModel(model: TValidationModel): void;
}
