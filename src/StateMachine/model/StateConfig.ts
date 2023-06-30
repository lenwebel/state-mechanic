import {State} from './State';

export type StateConfig<TValidationModel> = {
    [key: string]: State<TValidationModel>;
};
