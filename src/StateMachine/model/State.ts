import {StateConfig} from './StateConfig';

export class State<TValidationModel = any>  {
    
    public visible?: boolean = true;
    public name?: string;
    public url?: string;
    public state?: StateConfig<TValidationModel>;
    public next?: (model?: TValidationModel) => State<TValidationModel>;
    public previous?: (model?: TValidationModel) => State<TValidationModel>;
    public hide?: <TValidationModel>(model: TValidationModel, state?: State<TValidationModel>) => boolean;
    public validate?: <TValidationModel>(model: TValidationModel, state?: State<TValidationModel>) => boolean;
    public model?: TValidationModel;
       
    constructor() {
     
    }



}
