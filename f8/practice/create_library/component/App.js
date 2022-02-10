import html from '../core.js'
import {connect} from '../store.js'

const connector = connect()  

// tùy ý lấy ra dữ liệu ở trong store
//const connector = connect(state => ({
//    car: state.cars[0],
//    cars: state.cars
//}))


function App({ cars }) {
    return html `
        <ul>
            ${cars.map(car => `<li>${car}</li>`)}
        </ul>

        <button onclick="dispatch('ADD', 'Porsche')">Add car</button>

    `
}

export default connector(App)