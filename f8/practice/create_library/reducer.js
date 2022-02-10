const init = {
    cars: ['BMW']
}

export default function reducer(state = init, action, args) {
    //console.log(args)
    switch (action) {
        case 'ADD':
            //console.log({...state})
            const [newCar] = args
            return {
                ...state,
                cars: [...state.cars, newCar]
            }
            //return {cars: ['abc']}
        default:
            console.log(state)
            return state
    }
}