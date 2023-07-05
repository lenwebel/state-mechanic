import { InternalState, StateConfig } from './StateConfig';
export type StateType<TValidationModel = any> = InternalState<TValidationModel> | State<TValidationModel>;
export declare class State<TValidationModel = any> {
    visible?: boolean;
    name?: string;
    url?: string;
    state?: StateConfig<TValidationModel, StateType<TValidationModel>>;
    hide?: (model: TValidationModel, state?: StateType<TValidationModel>) => boolean;
    validate?: (model: TValidationModel, state?: StateType<TValidationModel>) => boolean;
    model?: TValidationModel;
}
//# sourceMappingURL=State.d.ts.map