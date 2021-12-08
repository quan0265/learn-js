- Một số hàm built-in:
	1. alert
	2. console
	3. confirm
	4. promt
	5. setTimeout
	6. setInterval

- Operators(toán tử):
	- Arithmteric(số học)
	- Assignment(gán)
	- Comparion(so sánh)
	- Logical(logic): &&, ||, !(not)

- Kiểu dữ liệu(data type):
	1. Dữ liệu nguyên thủy -Primitive Data
		- Number
		- String
		- Boolean
		- Null
		- Symboy
	2. Dữ liệu phức tạp - Complex Data
		- Function
		- Object

- String methods:
	1. Length
	2. Find index
	3. Cut string
	4. Replace
	5. Convert to upper case
	6. Convert to lower case
	7. Trim
	8. Split
	9. Get a charater by index

- Number methods:
	

- Array methods:
	- To string
	- Join
	- Pop
	- Push
	- Shift
	- Unshift
	- Splicing
	- Concat
	- Slicing

- Param in function:
	- Param: khi tạo function có tham số
	- Arguments: khi gọi function sử dụng thì truyền đối số vào
	- Thường gọi chung là tham số

- Function:
	- Khi function đặt trùng tên: thì dùng fucntion cuối
	- Khai báo biến trong hàm: thì chỉ dùng được trong hàm
	- Định nghĩa hàm trong hàm: thì chỉ dùng được trong hàm đó

- Function type:
	- Declaration function
	- Expression function
	- Arrow function 
	- Self-Invoking

- Object:
	- object constructor
	- object prototype(nguyên mẫu) - Basic
	- object Date

- Loop:
	- for: lặp với điều kiện đúng
	- for/in: lặp qua key của object | array | string
	- for of: lặp qua value của array | string
	- while: lặp khi điều kiện đúng
	- do/while: lặp ít nhất 1 lần, sau đó lặp khi điều kiện đúng
	- break
	- continue
	- nested loop(lặp lồng nhau)

- Array:
	- Create
	- Accessing, change an array element
	- Array element can be object
	- Adding array element: array.push
	- JavaScript does not support arrays with named indexes
	- The Difference Between Arrays and Objects: 
		- In JavaScript, arrays use numbered indexes.  
		- In JavaScript, objects use named indexes.
	- Length property 
	- Loop array

- Array methods:
	- toString
	- join: array to string, new= arr.join(' - ')
		- cách nhau bằng dấu ' - '
	- pop: remove last element from array
	- shift: remove first element from array
	- push: add element array (at the end)
	- unshift: add element array (at the start)
	- delete: delete array[index]
	- splice: method can be used to add new items to an array
		- array.splice(2, 0, "Lemon", "Kiwi")
		- parameter(2) vị trí start add 
		- parameter(0) có bao nhiêu element reomve from index (2)
		- The rest of the parameters ("Lemon" , "Kiwi") define the new elements to be added.
		- The splice() method returns an array with the deleted items
	- concat: arrayAll= arr1.concat(arr2)

- Array iteration(lặp lại):
	- length
	- forEach
	- every:
		- return true/fasle 
		- The every() method check if all array values pass a test, check all value thỏa mãn điều kiện  đúng thì return true, 1 lần false return false
	- some:
		- return true/false 
		- check one value thỏa mãn điều kiện trả về true
	- find: returns the value of the first array element that passes a test function else return undefined
	- filter: 
		- return new a array
		- return a new array with array elements that passes a test.
	- map:
		- Create một mảng mới bằng cách thực hiện function trên mỗi phần tử của mảng
		- Không thay đổi mảng ban đầu
		- Hay dùng trong render
	- reduce:
		- trả về 1 giá trị duy nhất
		- initial value: khi không có initial value thì sẽ lấy element first và giảm bớt 1 vòng lặp
	
- Array prototype create reduce

- Method includes:
	- Use for String | Array
	- return true|false

- Math object:
	- Math.PI 
	- Math.round()
	- Math.abs()
	- Math.ceil()
	- Math.floor()
	- Math.random()
	- Math.min()
	- Math.max()

- Callback:
	- Là hàm (function) 
	- Được truyền qua đối số khi gọi hàm khác
	- Được gọi lại (trong hàm nhận đối số)

- Empty elements of array:
	- Dùng for và length sẽ lặp qua cả element empty
	- Dùng for in, for of chỉ lặp qua các element có giá trị 

- Array create method ( tự định nghĩa phương thức cho array )
	- Array.prototype: xem tất cả phương thức cho array: 
	- Create method for array: 	Array.prototype.nameMethod= function() {  }
	- this.hasOwnProperty(index): nếu value nằm trong array, value gần nhất return true, trong prototype return fasle
	- Chi tiết array-create-forEach
	- Create find, filter, some, every, reduce



* HTML DOM


- HTML DOM: 
	- DOM: Document Object Model
	- Có 3 thành phần
		1. Element: tag h1, h2, p, ... 
		2. Attribute: href, class, title, ...
		3. Text, text node(khoảng trắng, kí tự, xuống dòng)
	- Node
	- Document object: console.log(document)
	- document.write('string')

- DOM get element method:
	- Show all method, attribute of one element:
		- var el= document.querySelector('#header')
		- console.log( { element: el } )
	- Select element:
		- document.querySelector('#header')
		- document.querySelectorAll('.content')
		- document.getElementById('header')
		- document.getElementsByTagName('div')
		- document.getElementsByClassName('content')
	- Select children element from node:
		- var boxNode= document.querySelector('#box')
		- boxNode.querySelectorAll('p')

- Dom attribute:
	- Set attribute (2 cách):
		- Seter: el.nameAttribute= 'string'
		- method: el.setAttribute('nameAttribute', 'string')
	- Get attribute (2 cách): 
		- el.nameAttribute
		- el.getAttribute('nameAttribute', 'string')
	- Chú ý dùng seter: có tên attribute trùng với tên thuộc tính có sãn của element thì không get và set được. Dùng method thì không ảnh hưởng

- Dom innerText vs textContent:
	- seter:
		- el.innerText= 'text'
		- el.textContent= 'text'
	- geter:
		- el.innerText: show text hiển thị trên browser
		- el.textContent: hiển thị text node: khoảng trắng, all text trong element

- DOM innerHTML vs outerHTML:
	- el.innerHTML= '<i>inner</i>'
	- el.outerHTML= '<i>inner</i>'  ('replace, ít dùng ')

- DOM node properties:
	- Show all node property: console.log( [el] ), {el}
	- attribute: contenteditable

- DOM css:
	- All style: console.log(el.style)
	- Set element css:
		1. el.style.width= '200px'
		2. Object.assign(el.style, { with: '200px', height: '100px' })
	- Get element css: el.style.widh

- DOM classList property:
	- add
	- contains: check has class, return true|false
	- remove
	- toggle: reomve|add

- DOM events:
	- Event:
		1. Attribute events: <h1 onclick="function(){console.log(this)}"></h1>
		2. Assign event using the element node:
			- el.onclick= function(e) { console.log(e) }
	- Show all PointerEvent when event is active: console.log(e)
	- e.target
	- Mốt số event hay dùng:
		- click
		- change
		- focus
		- keyup
		- keydown
		- keypress
		- mouseover
		- input
		- resize
		- scroll
		- submit
	- Event Properties and Methods: (xem thêm console.log(el.e))
		- target
		- which ( giá phím trên pc, 27 là nhấn phím Esc trên pc )

- DOM preventDefault and stopPropagation:
	- document.anchors  (lọc ra tất cả thẻ a có attr name)
	- document.links (lọc ra tất cả thẻ a có href)
	- e.preventDefault(): ngăn chặn hành vi xảy ra mặc định
	- stopPropagation: sự kiện nổi bọt
		- ví dụ: div>button, tag button nằm trong div, gán event khi click div thì console 'div', khi click button thì console 'button', nhưng khi click button thì div cũng được click luôn đây là sự kiện nổi bọt 

- Dome event listener:
	- Xử lý nhiều việc khi 1 event xảy ra
	- Lắng nghe / hủy bỏ lắng nghe
	- DOM event:
		- Hủy bỏ event click bằng cách setTimeout gán cho 1 function rỗng
	- DOM event listener:
		- el.addEventListener(event, func): có viết add event nhiều lần được
		- el.removeEventListner(event, func): hủy bỏ event
		- Example: 
			- addEventListener  function1, function2 vào 1 element, sau đó setTimeout 1 thời gian hủy bỏ 1 fucntion1 
			- el.addEventListener('click', function1), el.addEventListener('click', function2)
			- el.removeEventListener('click', function1)

- JSON:
	- Là một định dạng dữ liệu (chuỗi)
	- JSON.strinify(var)
	- JSON.parse(var)

- Promise:
	- sync, async
	- pain(nỗi đau)
	- concenpt
	- chain
	- methods: resolve(thành công), reject(thất bại), all
	- example
	- promise: là cách xử lý bất đồng bộ

- Promise sync, async:
	- sync: đồng bộ, code chạy tuần tự theo trình tự viết code from trên xuống
	- async: bất đồng bộ, các đoạn code phía dưới có thể chạy dù code bên trên chưa thực thi và trả về kết quả
		- setTimeout, setInterval, fetch
		- XMLHtpRequest, file reading
		- request animation frame
		- sử dung callback

- Promise pain:
	- callback hell
	- pryramid of doom

- Promise concept, (khái niêm, hoạt động):
	1. new Promise
	2. Executor
	- Có 3 trạng thái:
		- Pendding
		- Fulfilled(thành công)
		- Rejected
	- Khi resolve được gọi thì then được gọi
	- Khi reject được gọi thì catch được gọi
	- Khi resolve hoặc reject được gợi thì finally được gọi
	- Khái niệm: 
		- promise dùng để xử lý các thao tác bất đồng bộ, trước khi có promise thì dùng callback, callback thì xảy ra vấn đề là callback hell, code rối khó hiểu, promise dùng để khắc phục tình trạng callback hell, code dễ đọc dễ hiểu hơn
		- Để tạo ra được promise sử dụng kewword new Promise và trong constructor của nó truyền vào 1 excutor function, trong excutor function có 2 tham số, khi excutor thực thi nhận được 2 tham sô resolve, reject. Gọi resolve khi thao tác xử lý thành công, gọi reject khi thao tác xử lý thất bại
		- Khi chúng ta sử dụng promise đối tượng promise được tạo ra chúng ta sử dụng các phương thức là then, catch, fanally đều nhận callback function
		- Khi promise được resolve thì thực thi then
		- Khi promise được reject thì thực thi catch
		- Khi promise được resolve hoặc reject thực thi finally

- Promise chain(chuỗi):
	- Code multiple then, catch, finally: .then(function) .then(function) .catch(function)
	- Kết quả trả về của function đằng trước là đầu vào của function đằng sau
	- Nếu resolve hoặc then đằng trước không trả về dữ liệu gì thì sẽ trả về undefined
	- Nếu then1 không return 1 Promise thì sẽ chạy ngay then tiếp theo.
	- Nếu then1 return ra 1 promise thì phải chờ promise được giải quyết thì mới chạy tiếp

- Promise resolve, reject, all:
	- Có nhiều then, trong quá trình chạy có 1 promise bị reject thì không chạy xuống các chuỗi còn lại chạy xuống catch luôn
	- Có 1 số thư viện output luôn luôn là 1 promise
	- Promise.resolve
	- Promise.reject
	- Promise.all
		- Nếu các promise không phụ thuộc nhau thì nên chạy song song
		- Dùng Promise.all để chạy song song cac promise
		- Khi tất cả promise trong tham số chạy xong thì mới chạy then trong Promise.all
		- Khi có 1 promise bị reject thì chạy catch trong Promise.all

- Fetch: 
	- https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
	
- JSON server:
	- cài đặt :
		- npm init -> enter...
		- npm install json-server: cài trên folder. npm -g install json-server: cài hẳn trên máy tính
		- Create file db.json 
		- run:
			- Cách 1: json-server --watch db.json
			- Cách 2: 
				- file package.json 
				- Add "start": json-server --watch db.json vào index scripts
				- run npm -start
		- Browse: http://localhost:3000
		- Ctrl+c để thoát

- Postman làm việc với REST API:
	- CRUD:
		- Create: Tạo mới -> POST
		- Read: Lấy dữ liệu -> GET
		- Update: Chỉnh sửa -> PUT/PATCH, name/id
		- Delete: Xóa -> DELETE, name/id
	- Postman

- Thêm sửa, xóa với fetch và rest api
	- run npm start, Ctrl+c để thoát
	- Sử dụng fetch để ajax






* ES6+

	- Khái niệm ES6+
	1. Let, const
	2. Template Literals
	3. Multi-line String
	4. Arrow function
	5. Classes
	6. Default parameter values
	7. Destructuring
	8. Rest parameters
	9. Spread
	10. Enhanced object literals
	11. Tagged template literal
	12. Modules

- Let, const:
	- Var / Let, Const: Scope(phạm vi), Hosting(lưu trữ)
		- Hosting: khai báo tên sau cũng được, chỉ hỗ trợ var
	- Const / Var, Let: Assignment
		- const không thể assignment lần thứ 2, thay đổi thuộc tính của object thì được
	// Code block: if else, loop, {}, ...

- Template literal:
	- Sử dụng dấu  `text ${var}  \\ \$ `; 
	- Sử dụng dấu ` ` viết multi-line string

- Arrow function:
	- Viết tắt cho function: 
		- (param1, param2) => {  } 
		- Có thể bỏ { } khi có return : (a, b) => a + b
		- Viết tăt khi return là 1 object viết trong ngoặc tròn ( ): (a, b) => ({ a: a, b: b })
		- Có 1 tham số bỏ dấu ngoặc tròn: param1 = > console.log(param1)
	- Chú ý: iên quan đến keyword this sử dụng trong object không dùng được arrow function:
		- Trong method của 1 object arrow function không có context, function thông thường thì có
		- Arrow function không sử dụng được object constructor

- Classes

- Default paramter values

- Enhanced object literals in javascript ES6: 
	- Cung cấp viết code ngắn gọn hơn
	- Định nghĩa key: value cho object
	- Định nghĩa method cho object 
	- Định nghĩa key cho object dưới dạng biến

- Destructuring, rest parameters
	- destructuring: var [a, , c]= ['php', 'html', 'css']
	- rest parameters (tham số phần còn lại) trả về array hoặc object chứa các phần tử còn lại
		- var [a, ...var]= ['php', 'html', 'css'], biến var là 1 array: ['html', 'css']
		- var {name, ...newObject}= {name: 'php', age: 12}
	- Có 2 trường hợp là toán tử rest:
		- Khi là toán tử rest là kết hợp với destructuring
		- Sử dụng trong việc định nghĩa thàm số gần giống với arguments: function logger(...params) {  }

- Spread:
	- Sử dụng trong nối mảng
	- Sử dụng hợp nhất 2 object
	- Khi gọi đến hàm truyền đối số không gọi là rest, gọi là spread: nameFunction(...array)

- Tagged template literals
	
- Modules:
	- Import / Export

- Optional chaining:
	- Sử dụng khi key của 1 object có tồn tại hay không, get from api .
	- if( obj?.cat?.cat2?.cat3 )







* Nâng cao:

	1. IIFE
	2. Clourses
	3. Hoisting
	4. Strict mode
	5. This keyword
	6. Bind  method
	7. call method
	8. Apply method
	9. Catching, throwing, errors
	10. Promise
	11. Async function, await


- IIFE: Immediately Invoked Function Expression
	- Tạo ra function và gọi ngay lập tức
	- Dùng dấu ; trước IIFE
	- IIFE là hàm "private": không thể truy cập from bên ngoài, có truy cập bên trong dùng đe quy
	- Sử dụng IIFE khi nào
		- Viết thư viện, tên biến, hàm không trùng với bên ngoài
		- Ứng dụng cực kì an toàn, người khác hoặc bạn không thể nào vô tình làm error ứng dụng bởi vì chỉ có thể tương tác với các phương thức được publish ra mà thôi.
	- Các cách tạo ra một IIFE
	- Ví dụ sử dụng IIFE
		- Tạo 1 object, có thuộc tính không muốn truy cập from bên ngoài

- Scope(phạm vi):
	- Các loại phạm vi:
		- Global - toàn cầu
		- Code block - khối mã: let, const
		- Local scope - hàm: var function
			- Khai báo trong hàm thì chỉ thuộc phạm vi hàm
	- Khi gọi mỗi hàm luôn có 1 phạm vi mới đươc tạo
	- Các hàm có thể truy cập các biến được khai báo trong phạm vi của nó và bên ngoài nó
	- Cách thức một biến được truy cập: from trong ra ngoài, from trong phạm vi đó -> phạm vi ngoài cùng
	- Khi nào một biến bị xóa khỏi bộ nhớ
		- Biến toàn cầu
		- Biến trong code block & trong hàm
		- Biến trong hàm được tham chiếu bởi một hàm

- Closure
	- Là một hàm có thể ghi nhớ nơi nó được tạo và truy cập được biến ở bên ngoài phạm vi của nó
	- Ứng dung:
		- Viết code ngắn gọn
		- Biểu diễn, ứng dụng tính Private trong OOP
	- Lưu ý 
		- Biến được tham chiếu (refer) trong closure sẽ không được xóa khỏi bộ nhớ khi hàm cha thực thi xong
		- Các khái niệm JavaScript nâng cao rất dễ gây nhầm lẫn

- Hoisting:
	- var
	- let, const

- use strict:
	- Báo lỗi hoặc ngăn chặn khi sử dụng những đoạn mã không an toàn hay dễ gây nhầm lẫn
	- Cách dùng:
		1. Thêm "use strict"; vào đầu file .js
		2. Thêm "use strict"; vào ngay sau thẻ mở <script> </script>
		3. Thêm "use strict"; vào đầu phạm vi hàm, chỉ dùng cho hàm đó
	- Đặc trưng không thể khai báo biến mà không sử dụng keyword var, let
	- Báo lỗi khi gán lại giá trị cho thuộc tính có writable ( có thể ghi ): false
	- Báo lỗi khi hàm có tham số trùng tên
	- Khai báo hàm trong code block thì hàm sẽ thuộc phạm vi code block
	- Không đặt tên biến, tên hàm bằng một số keyword "nhạy cảm" của ngôn ngữ
	- Công dụng:
		- Tránh "quên" keyword khai báo biên
		- Tránh trùng tên biến lẫn tới lỗi logic
		- Sử dụng bộ nhớ hiệu quả vì tránh tạo biến global

- Value types (tham trị) & Reference type (tham chiếu):
	1. Value types (Primitivie (nguyên thủy) data types):
		- String
		- Number
		- Boolean
		- BigInt
		- Symbol
		- undefined
		- null
		- Value types trả về giá trị
	2. Reference types (Non-primitivie (không nguyên thủy) data types):
		- Object
		- Array
		- Function
		- Reference types trả về địa chỉ vùng nhớ
	- Data types with functions:
		- Value types
		- Reference types

- This:
	- Keyword this trong javascript đề cập đến đối tượng mà nó thuộc về
	- this trỏ đến đối tượng trước dấu . gọi phương thức
	- Đặc tính:
		1. Trong một phương thức, this tham chiếu tới đối tượng truy cập phương thức (đối tượng trước dấu .)
		2. Đứng ngoài phương thưc, this tham chiếu tới đối tượng global
	- Lưu ý:
		- this trong hàm tạo là đại diện cho đối tượng sẽ được tạo
		- this trong một hàm là undefined khi ở strict mode
		- Các phương thức bind(), call(), apply() có thể tham chiếu this tới đối tượng khác
		- Trong đối tượng viết method sử dụng arrow function không sử dụng được this nên trả về bên ngoài của đối tượng là window
		- Đối với object, 1 method là 1 function, trong function có 1 arrow function thì this trong arrow function đó không có context nên sẽ lấy this ở bên ngoài là this trong method là object đấy

- Fn.bind() method:
	- Phương thức bind() sẽ trả về một hàm mới, 1 vùng nhớ mới được tạo ra không phải function ban đầu
	- Có thể nhận các đối tượng như hàm ban đầu
	- Ví dụ: 
		1. bind document object
		2. DOM listen events
		3. kết hợp object methods + DOM listen events
	- Tóm tắt:
		- Phương thức bind() cho phép ràng buộc chia this cho một phương thức (function)
		- Phương thức bind() sẽ trả về một hàm mới vói context được bind
		- Hàm được trả về from bind() vẫn có thể nhậ các đối số của hàm gốc
	- console.dir(Function): phương thức bind là 1 function được define trong constructor nên tất cả các hàm trong javascript đều được kế thừa lại method này, bind là ràng buộc, trả ra 1 trả ra 1 function, method mới với 1 this mới

- Fn.bind() method:
	- inputElement.focus(): focus chuột vào 1 input
	- 1 object có 1 method, trong method đó có 1 arrow function, thì this trong arrow function không có context, nên sẽ trỏ đến bên ngoài là chính object đó
	- Hướng dẫn delegate: khi tạo mới element không cần thêm lại event cho element
		- e.target.closest('.delete') 
			- tìm class delete gần nhất bao quanh element con được click đến element id_root gán sự kiện nếu không có trả về null, có trả về element có class delete
			- id_root.onclick= function(e) { e.target.closest('.delete') }
	- el.dataset.index: data attribute

- Fn.call() method:
	- console.dir(Function.prototype)
	- Là phương thức trong prototype của Function constructor, phương thức này được dùng để gọi hàm và cũng có thể bind this cho hàm
	- Ví dụ: 
		- Gọi hàm với call method
		- Gọi hàm và bind this, lưu ý trong strict mode vẫn có this nếu được bind
		- Thể hiện tính kế thừa (extends) trong OOP, Animal.call(this, name, weight)
		- Mượn hàm (function borrowing), thêm ví dụ với arguments
	