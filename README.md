# state-mechanic

And another state machine

## Install

`npm install state-mechanic`


## Usage

```javascript
import { StateMachine } from 'state-mechanic';

const stateMachine = new StateMachine({
  initialState: 'idle',
  states: {
    idle: {
      name: 'idle',
    },
    running: {
        name: 'running',
        ,
    },
  },
});
```

## Output 

```javascript 

```