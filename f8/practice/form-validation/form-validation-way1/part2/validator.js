
// Contructor function
function Validator(options) {
	// console.log(options)

	var selectorRules = {};

	// Hàm thực hiện validate
	function validate(inputElement, rule) {
		var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
		// var errorMessage = rule.test(inputElement.value);
		var errorMessage;
		// console.log(errorMessage);

		// Lấy qua từng rule của mỗi selector
		var rules = selectorRules[rule.selector];

		// console.log(rules);
		// Lặp qu từng rule và kiểm tra
		for (var i = 0; i < rules.length; i++) {
			errorMessage = rules[i](inputElement.value);
			if (errorMessage) break;
		}


		if (errorMessage) {
			errorElement.innerText = errorMessage;
			inputElement.parentElement.classList.add('invalid');
		}
		else {
			errorElement.innerText = '';
			inputElement.parentElement.classList.remove('invalid');
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
					var enableInputs = formElement.querySelectorAll('[name]:not([disable])');
					var formValues = Array.from(enableInputs).reduce(function(values, input) {
						// gán vlues[] sau đó return values
						return (values[input.name] = input.value) && values;
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

			var inputElement = formElement.querySelector(rule.selector);
			// console.log(inputElement);
			if (inputElement) {
				// Xử lý trường hợp blur khỏi input
				inputElement.onblur = function() {
					// console.log('blur' + rule.selector);
					// console.log(rule);
					validate(inputElement, rule);
				}

				// Xử lý mỗi khi người dùng nhập vào input
				inputElement.oninput = function() {
					var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
					errorElement.innerText = '';
					inputElement.parentElement.classList.remove('invalid');
				}
			}

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
			return value.trim() ? undefined : message || 'Vui lòng nhập trường này';
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