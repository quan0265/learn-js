
function Validator(formSelector) {
	var _this = this;
	var formRules = {};

	/*
	* Quy ước tạo rule:
		- Nếu có lỗi thì return error
		- Nếu không có lỗi thì return undefined
	*/
	var validatorRules = {
		required: function(value) {
			return value ? undefined : 'Vui lòng nhập trường này';
		},
		email: function(value) {
			var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			return regex.test(value) ? undefined : 'Vui lòng nhập email';
		},
		min: function(min) {
			return function (value) {
				return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự`;
			}
		},
		max: function(max) {
			return function (value) {
				return value.length <= max ? undefined : `Vui lòng nhập ít nhất ${max} kí tự`;
			}
		}
	}

	// Lấy ra form element trong DOM theo formSelector
	var formElement = document.querySelector(formSelector);

	// Chỉ xử lý khi có element trong DOM
	if (formElement) {

		var inputs = formElement.querySelectorAll('[name][rules]');

		for (var input of inputs) {

			var rules = input.getAttribute('rules').split('|');
			for (var rule of rules) {

				var ruleFunc = validatorRules[rule];

				if (rule.includes(':')) {
					var ruleInfo = rule.split(':');
					rule = ruleInfo[0];

					ruleFunc = validatorRules[rule](ruleInfo[1]);
				}

				// console.log(rule);

				if (Array.isArray(formRules[input.name])) {
					formRules[input.name].push(ruleFunc);
				}
				else {
					formRules[input.name] = [ruleFunc];
				}
			}

			// Lắng nghe sự kiện để validate (blur, change, ...);
			input.onblur = handleValidate;
			input.oninput = handleClearError;
		}

		function handleValidate(event) {
			var rules = formRules[event.target.name];
			var errorMessage;

			// rules.find(function (rule) {
			// 	errorMessage = rule(event.target.value);
			// 	return errorMessage;
			// })

			for (var rule of rules) {
				errorMessage = rule(event.target.value);
				if (errorMessage) break;
			}

			// Nếu có lỗi thì hiển thị mesage lỗi râ UI
			if (errorMessage) {
				// console.log(event.target);
				var formGroup = event.target.closest('.form-group');
				if (formGroup) {
					formGroup.classList.add('invalid');
					var formMessage = formGroup.querySelector('.form-message');
					if (formMessage) {
						formMessage.innerText = errorMessage;
					}
				}
			}

			// if undefined return true, if error return false
			return !errorMessage;
		}

		function handleClearError(event) {
			var formGroup = event.target.closest('.form-group');
			if (formGroup.classList.contains('invalid')) {
				formGroup.classList.remove('invalid');
			}
		}


	}

	// Xử lý hành vi submit form
	formElement.onsubmit = function (event) {
		event.preventDefault();

		var inputs = formElement.querySelectorAll('[name][rules]');
		var isValid = true;

		for (var input of inputs) {
			// console.log(handleValidate({target: input}));
			if (!handleValidate({ target: input })) {
				isValid = false;
			}
		}

		// Khi không có lỗi thì submit form
		if (isValid) {
			if (typeof _this.onSubmit === 'function') {
				var enableInputs = formElement.querySelectorAll('[name]');
				var formValues = Array.from(enableInputs).reduce(function(values, input) {

					// gán vlues[] sau đó return values
					switch(input.type) {
						case 'radio':
							var value_el = formElement.querySelector('input[name='+ input.name +']:checked');
							values[input.name] = value_el ? value_el.value : '';
							break;
						case 'checkbox':
							if (!input.matches(':checked')) {
								values[input.name] = '';
								return values;
							}

							if (!Array.isArray(values[input.name])) {
								values[input.name] = [];
							}
							values[input.name].push(input.value);
							break;
						case 'file':
							values[input.name] = input.files;
							break;
						default:
							values[input.name] = input.value;
					}

					return values;						
				}, {});

				// Gọi lại hàm onSubmit và trả về giá trị của form
				_this.onSubmit(formValues);
			}
			else {
				formElement.submit();
			}
		}

	}

	// console.log(formRules);


}