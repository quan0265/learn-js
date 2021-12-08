
- Code editor:
	- codemirror:
		- https://github.com/codemirror/codemirror
		- https://codemirror.net/doc/manual.html#addons
			- serch demo, click -> link demo
			- https://codemirror.net/demo/matchtags.html
		- https://www.youtube.com/watch?v=o1DDWQDBT9Y
		- dowload code: https://codemirror.net/codemirror.zip

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