
// Contructor function
function Validator(options) {
	// console.log(options)

	// dùng closet hoặc function getParent 
	function getParent(element, selector) {
		while (element.parentElement) {
			if (element.parentElement.matches(selector)) {
				return element.parentElement;
			}
			element = element.parentElement;
		}
	}

	var selectorRules = {};

	// Hàm thực hiện validate
	function validate(inputElement, rule) {
		var errorElement = inputElement.closest(options.formGroupSelector).querySelector(options.errorSelector);
		// var errorMessage = rule.test(inputElement.value);
		var errorMessage;
		// console.log(errorMessage);

		// Lấy qua từng rule của mỗi selector
		var rules = selectorRules[rule.selector];

		// console.log(rules);
		// Lặp qua từng rule và kiểm tra
		// Nếu có lỗi thì dừng việc kiểm tra
		for (var i = 0; i < rules.length; i++) {
			switch (inputElement.type) {
				case 'radio':
				case 'checkbox':
					errorMessage = rules[i](
						formElement.querySelector(rule.selector + ':checked')
					);
					break;
				default:
					errorMessage = rules[i](inputElement.value);
			}

			if (errorMessage) break;
		}


		if (errorMessage) {
			errorElement.innerText = errorMessage;
			inputElement.closest(options.formGroupSelector).classList.add('invalid');
		}
		else {
			errorElement.innerText = '';
			inputElement.closest(options.formGroupSelector).classList.remove('invalid');
		}

		return !errorMessage;
	}

	// Lấy element của form cần validate
	var formElement = document.querySelector(options.form);
	// console.log(options.rules);
	if (formElement) {
		// Khi submit form
		formElement.onsubmit = function(e) {
			e.preventDefault();

			var isFormValid = true;

			//Lặp qua từng rule và validate
			options.rules.forEach(function(rule) {
				var inputElement = formElement.querySelector(rule.selector);
				var isValid = validate(inputElement, rule);
				if(!isValid) {
					isFormValid = false;
				}
			})


			if (isFormValid) {
				// Trường hợp submit với javascript
				if (typeof options.onSubmit === 'function') {
					// Tất cả filed có attribute là name và không có disable
					// var enableInputs = formElement.querySelectorAll('[name]:not([disable])');
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
					options.onSubmit(formValues);
				}
				// Trường hợp submit với hành vi mặc định
				else{
					formElement.submit();
				}
			}
		}

		// Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input, ...)
		options.rules.forEach(function (rule) {
			// console.log(rule);

			// Lưu lại các rules cho mỗi input
			if (Array.isArray(selectorRules[rule.selector])) {
				selectorRules[rule.selector].push(rule.test);
			}
			else{
				selectorRules[rule.selector] = [rule.test];
			}

			var inputElements = formElement.querySelectorAll(rule.selector);
			// console.log(inputElements);

			Array.from(inputElements).forEach(function (inputElement){
				// Xử lý trường hợp blur khỏi input
				inputElement.onblur = function() {
					// console.log('blur' + rule.selector);
					// console.log(rule);
					validate(inputElement, rule);
				}

				// Xử lý mỗi khi người dùng nhập vào input
				inputElement.oninput = function() {
					var errorElement = inputElement.closest(options.formGroupSelector).querySelector(options.errorSelector);
					errorElement.innerText = '';
					inputElement.closest(options.formGroupSelector).classList.remove('invalid');
				}
			}) 
		})

		console.log(selectorRules);
	}

}

// define rules
// Nguyên tắc của rules:
// 1. Khi có lỗi => trả ra message
// 2. Khi hợp lệ => không trả ra cái gì cả (undenfined)

Validator.isRequired = function (selector, message) {
	return {
		selector: selector,
		test: function (value) {
			return value ? undefined : message || 'Vui lòng nhập trường này';
		}
	}
}

Validator.isEmail = function (selector, message) {
	return {
		selector: selector,
		test: function (value) {
			var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			return regex.test(value) ? undefined : message || 'Trường này phải là email';
		}
	}
}

Validator.minLength = function (selector, min, message) {
	return {
		selector,
		test: function (value) {
			return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
		}
	}
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
	return {
		selector,
		test: function (value) {
			return value === getConfirmValue() ? undefined : message || `Giá trị nhập vào không chính xác `;
		}
	}
}