import { State } from './State';
export declare class InternalState<TValidationModel = any> extends State<TValidationModel> {
    next: (model?: TValidationModel) => InternalState<TValidationModel>;
    previous: (model?: TValidationModel) => InternalState<TValidationModel>;
}
export type StateConfig<TValidationModel, TState = State<TValidationModel>> = {
    [key: string]: TState;
};
