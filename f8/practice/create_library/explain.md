LUỒNG CHẠY CODE:

1. Chạy script.js 
1.1_ import { attach } from "./store.js";

1.2_ attach(App, document.getElementById('root'))   // truyền đối số: component và  root.

1.3_ const { attach, connect, dispatch } = createStore(reducer) // attach import từ createStore.

1.4_    attach(component, root) {
            roots.set(root, component)  // Khi attach được thực thi thì nó set root là key, component là value.
            render()                    // gọi lại hàm render()
        },

1.5_    function render() {         
            for (const [root, component] of roots) {    // component là những thành phần chứa view.
                const output = component()
                root.innerHTML = output
            }
        }

==> +, map qua roots, nhận lại root vừa xét và component. Và component là file App (App là 1 cái hàm). 
    +, Khi core.js chạy nó sẽ chạy component().
    +, Trong trường hợp đầu tiên, nó sẽ gọi hàm App (hàm App bên App.js) => Nó sẽ nhận những value của hàm App (những cái html).
    +, html (App.js) xử lý rồi lưu vào output. Và output sẽ đẩy vào root.innerHTML => render ra view của ta.

2. LOGIC REACT
2.1_ Store là trung tâm => createStore là hàm nhận đối số là reducer.
    +, Và nó mong muốn reducer trong trường hợp mặc định phải return lại 1 giá trị khởi tạo luôn để nó làm state ban đầu  let state = reducer().

    +, Chính vì vậy, ban đầu ta có 1 init mặc định sẵn của reducer và state ban đầu của reducer chính là init luôn.
        const init = {
            cars: ['BMW']
        }

    +, Trong trường hợp lần đầu tiên thì những action chưa được thực hiện => lọt vào case default dưới => return state mặc định chính là init ở trên.
        switch (action) {
            case 'ADD':
                const [newCar] = args
                return {
                    ...state, 
                    cars: [...state.cars, newCar]
                }
            default: 
                return state
        }

    +, Nên là file core.js có let state = reducer() lần đầu nhận giá trị init. 

2. LOGIC REACT
2.1_ Store là trung tâm => createStore là hàm nhận đối số là reducer.
    +, Và nó mong muốn reducer trong trường hợp mặc định phải return lại 1 giá trị khởi tạo luôn để nó làm state ban đầu  let state = reducer().

    +, Chính vì vậy, ban đầu ta có 1 init mặc định sẵn của reducer và state ban đầu của reducer chính là init luôn.
        const init = {
            cars: ['BMW']
        }

    +, Trong trường hợp lần đầu tiên thì những action chưa được thực hiện => lọt vào case default dưới => return state mặc định chính là init ở trên.
        switch (action) {
            case 'ADD':
                const [newCar] = args
                return {
                    ...state, 
                    cars: [...state.cars, newCar]
                }
            default: 
                return state
        }

    +, Nên là file core.js có let state = reducer() lần đầu nhận giá trị init. 

2.2_ Hàm connect là hàm đẩy dữ liệu từ store ngược vào view.
    +, Giá trị mặc định của state là ô tô ['BMW']. 

    +, Trong App.js ta gọi tới hàm connect. 
        import { connect } from '../store.js'

    +, Hàm connect() thực thi và nó trả lại 1 hàm mới lưu vào hàm connector.
        const connector = connect()

    +, connector nhận vào App. 
        export default connector(App)

        connect(selector = state => state) {
            return component => (props, ...args) =>
                component(Object.assign({}, props, selector(state), ...args))
        },

HAY: 
    connect(selector = state => state){
        return component => {
            return (props, ...args) => {
                return component(Object.assign({}, props, selector(state), ...args))
            }
        }
    }

==> +, connect chạy sẽ return lại 1 arrow function, nhận đối số là 1 component.

    +, Thế nên kết quả return sẽ được lưu vào connector.

    +, Mà connector lại là 1 hàm và nó nhận đối số là component chính là App nên nó sẽ trả ra 1 hàm mới nữa ở lần số 3 return.

    +, Hàm mới này sẽ chạy component của chúng ta, nó sẽ run cái function App.
        return component(Object.assign({}, props, selector(state), ...args))

    +, Và nó trả lại 1 Object được hợp nhất bởi props, bởi state (kho dữ liệu của ta) và kể cả những đối số sẽ truyền trong tương lai (...args).

    +, Cuối cùng ta nhận lại 1 biển props.
    
    +, Nó gọi component thực ra là gọi App. 
        Object.assign({}, props, selector(state), ...args) truyền vào cars trong function App({ cars }) {...}

    +, Vì vậy khi ở  App({ cars }) ta nhận được cars luôn ==> giúp ta truyền dữ liệu từ store sang view.

    +, Vì cars là mảng nên sau khi return xong sẽ được map qua, trả ra html và đẩy vào hàm html sẽ loại bỏ đi dấu phẩy, boolean nọ kia.
            return html`
                <ul>
                    ${cars.map(car => `<li>${car}</li>`)}
                </ul>

                <button onclick="dispatch('ADD', 'Porsche')">Add car</button>
     
            `
2.3_ Hàm dispatch 
    +, Khi bắt sự kiện onclick nó sẽ gọi dispatch sẽ truyền 1 action và value 
        <button onclick="dispatch('ADD', 'Porsche')">Add car</button>
    
    +, Khi dispatch được chạy nó sẽ gọi reducer, nó lấy giá trị state có giá trị từ lần trước đó là BMW, nó đẩy ngược vào state làm đối số đầu vào.
        dispatch(action, ...args) {
            state = reducer(state, action, args)
            render()
        }
    
    +, Và nó đẩy action  sang, dữ liệu mới sang (args)

    +, Trong reducer, ta lai bắt trường hợp nếu mà action là 'ADD' thì ta lấy ra dữ liệu mới từ args là newCar 
         case 'ADD':
            const [newCar] = args
            return {
                ...state, 
                cars: [...state.cars, newCar]
            }
    
    +, Và ta return lại 1 object mới, nhưng object mới lại được tạo ra từ object cũ và nó chỉ sửa cars bằng cách thêm newCar vào cuối mảng thôi.

    +, Nó thỏa mãn điều kiện là nhận state cũ và nó chỉnh sửa rồi nó đẩy ra state mới.

    +, state mới được đẩy ra rồi, nó gọi lại hàm render()
        function render() {     
            for (const [root, component] of roots) {    // component là những thành phần chứa view.
                const output = component()
                root.innerHTML = output
            }
        }
    
    +, Hàm render() được gọi lại thì nó lại gọi component(), và component() lại là App.

    +, Để gọi App thì lại phải thông qua connector => lại thông qua connnect() và cuối cùng nó lại vòng lại và lấy được state mới. 
        connect(selector = state => state)

    +, Vì state được update mới ở đây (dòng dưới) rồi, nó lại vòng lên connect trên nó lấy lại state mới => view bên html`` nhận được ô tô mới và nó render lại. 
        state = reducer(state, action, args)
*/