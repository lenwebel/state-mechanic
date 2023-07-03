import { StateConfig } from './StateConfig';
export declare class State<TValidationModel = any> {
    visible?: boolean;
    name?: string;
    url?: string;
    state?: StateConfig<TValidationModel>;
    next?: (model?: TValidationModel) => State<TValidationModel>;
    previous?: (model?: TValidationModel) => State<TValidationModel>;
    hide?: <TValidationModel>(model: TValidationModel, state?: State<TValidationModel>) => boolean;
    validate?: <TValidationModel>(model: TValidationModel, state?: State<TValidationModel>) => boolean;
    model?: TValidationModel;
    constructor();
}
//# sourceMappingURL=State.d.ts.map