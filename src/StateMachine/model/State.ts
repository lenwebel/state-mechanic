import {InternalState, StateConfig} from './StateConfig';

export type StateType<TValidationModel = any> = InternalState<TValidationModel> | State<TValidationModel>;


export class State<TValidationModel = any>  {
   
    /**
     * @description set to false to hide the state from the UI
     */
    public visible?: boolean = true;

    /**
     * @description provide a machine readable name for the state 
     */
    public name?: string;

    /**
     * @description provide a human readable name for the state 
     */
    public displayName?: string;

    /**
     * @description provide a url for the state if used with routing
     */
    public url?: string;

    /**
     * @description provide a nested state if required
     */
    public state?: StateConfig<TValidationModel, StateType<TValidationModel>>;

    /**
     * @description Use this action to hide the state.
     */
    public hide?: (model?: TValidationModel, state?: StateType<TValidationModel> ) => boolean;
    
    /**
     * @description Use this action to validate the state.
     * @returns true if the state is valid, false if not
     */
    public validate?: (model: TValidationModel, state?: StateType<TValidationModel>) => boolean;

    // /**
    //  * @description used internally to store the model
    //  */
    // public model?: TValidationModel;
}
