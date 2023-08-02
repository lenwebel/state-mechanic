import {State} from './State';

export class StateNode<TValidationModel> {
    public state: InternalState<TValidationModel>;
    public model?: TValidationModel;

    constructor(state: InternalState<TValidationModel>, model?: TValidationModel) {
        this.state = state;
        this.model = model;
    }


    // Define the next() function using the model stored in this instance
    public next(): InternalState<TValidationModel> {
        console.log('next state', this.model);

        if (this.state?.next?.()?.hide?.(this.model) === true) {
            return this.state.next();
        }

        if (!this.state.next)
            throw new Error('next state is undefined');

        return this.state.next();
    }

    // Define the previous() function using the model stored in this instance
    public previous(): InternalState<TValidationModel> {
        console.log('previous state', this.model);

        if (this.state?.previous?.().hide?.(this.model) === true) {
            return this.state.previous();
        }

        if (!this.state.previous)
            throw new Error('previous state is undefined');

        return this.state.previous();
    }


}

export class InternalState<TValidationModel = any> extends State<TValidationModel> {
    public model?: TValidationModel;
    public next: () => InternalState<TValidationModel>;
    public previous: () => InternalState<TValidationModel>;
    public setModel: (model: TValidationModel) => void;
}

export type StateConfig<TValidationModel, TState = State<TValidationModel>> = {
    [key: string]: TState;

};
