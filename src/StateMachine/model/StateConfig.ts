import {TypeVariable} from 'typescript';
import {State, StateType} from './State';


export class InternalState<TValidationModel = any> extends State<TValidationModel> {
    public next: (model?: TValidationModel) => InternalState<TValidationModel>;
    public previous: (model?: TValidationModel) => InternalState<TValidationModel>;
}

export type BaseConfig<TConfigType, TValidationModel> = TConfigType & { [key: string]: State<TValidationModel> };

export type StateConfig<TValidationModel, TState = State<TValidationModel>> = {
    [key: string]: TState;
};
