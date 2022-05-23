
- Code editor:
	- codemirror:
		- https://github.com/codemirror/codemirror
		- https://codemirror.net/doc/manual.html#addons
			- serch demo, click -> link demo
			- https://codemirror.net/demo/matchtags.html
		- https://www.youtube.com/watch?v=o1DDWQDBT9Y
		- dowload code: https://codemirror.net/codemirror.zip
		- https://www.youtube.com/watch?v=wK2jmHWP6eU
		- How to Create a Personal Online PHP Editor:
			- https://phppot.com/php/how-to-create-a-personal-online-php-editor/

	- ace editor:
		- https://ace.c9.io/
		- build: https://github.com/ajaxorg/ace-builds/
		- https://github.com/ajaxorg/ace
		- https://ace.c9.io/build/kitchen-sink.html
		- https://cdnjs.com/libraries/ace
		- xem các ví dụ các hàm config file demo.js
		- xem các thuộc tính, method: 
			1. file ace.js -> nhấn phím ctrl + f config.defineOptions
			2. https://ace.c9.io/#nav=api&api=editor click function
			3. console.log(editor.renderer), console.log(editor)
		- Get value of code: editor.getValue(), editor.session.getValue();
		- editor.setValue(value);
		- editor.container.style.lineHeight = 1.4;

	- manaco editor:
		- Source: npm install monaco-editor
		- examples: https://github.com/microsoft/monaco-editor/tree/main/samples
		- docs: https://microsoft.github.io/monaco-editor/api/modules/monaco.html

- upvotejs:
	- https://github.com/janosgyerik/upvotejs
	- initialization:
		- Tạo biến callback = 1 function;
		- Upvote.create('id', {count: 5, upvoted: true, callback: callback});
		- Upvote.create('id', {count: 5, downvoted: true, starred: true, callback: callback});
		- $('#id').upvote({count: 5, downvoted: true, starred: true, callback: handleVote});

- highlight code:
	- rainbow: 
		- https://github.com/ccampbell/rainbow
		- https://www.javascripting.com/view/rainbow#rainbowcolor
		- text code -> text code highlight:
			- has file rainbow.js, generic.js, code language js
			- Rainbow.color('text code', 'php', function(text_highlight) { console.log(text_highlight) } )

- jquery ui:
	- sortable element
	- slider range: https://jqueryui.com/resources/demos/slider/range.html
	- effects:

- toastr: alert
	- https://codeseven.github.io/toastr/demo.html

- split panel:
	- Phân vùng các khối, có thể thay đổi chiều dài hoặc chiều rộng thẻ div
	- https://github.com/nathancahill/split/tree/master/packages/splitjs#installation

- polyfill 
	- chạy được html, css, js version trên trình duyệt cũ
	- <script async src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>