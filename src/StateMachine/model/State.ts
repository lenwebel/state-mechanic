import {InternalState, StateConfig} from './StateConfig';

export type StateType<TValidationModel = any> = InternalState<TValidationModel> | State<TValidationModel>;


export class State<TValidationModel = any>  {
    
    public visible?: boolean = true;
    public name?: string;
    public url?: string;
    public state?: StateConfig<TValidationModel, StateType<TValidationModel>>;
    // public next?: (model?: TValidationModel) => State<TValidationModel>;
    // public previous?: (model?: TValidationModel) => State<TValidationModel>;
    public hide?: (model: TValidationModel, state?: StateType<TValidationModel> ) => boolean;
    public validate?: (model: TValidationModel, state?: StateType<TValidationModel>) => boolean;
    public model?: TValidationModel;
      
}
