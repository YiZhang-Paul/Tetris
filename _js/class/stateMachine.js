//stack based finite state machine
export default class StateMachine {

    constructor(originator, defaultState) {

        this.originator = originator;
        this.states = [];
        this.defaultState = defaultState;
        //initialize state tracker if default state is given
        if(defaultState) {

            this.push(defaultState);
        }
    }

    //current active state
    get active() {

        return this.states.length ? this.states.slice(-1)[0] : null;
    }

    reset() {

        this.states = this.defaultState ? [this.defaultState] : [];
    }

    push(state) {

        if(this.active !== state) {

            this.states.push(state);
        }
    }

    //remove current active state
    pop() {

        this.states.pop();
    }

    //swap current active state with given state
    swap(state) {

        if(this.active) {

            this.pop();
        }

        this.push(state);
    }

    update(timeStep, key) {

        if(this.active) {

            this.originator[this.active](timeStep, key);
        }
    }
}