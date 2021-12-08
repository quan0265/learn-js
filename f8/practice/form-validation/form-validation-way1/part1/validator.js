
// Contructor function
function Validator(options) {
	// console.log(options)

	// Hàm thực hiện validate
	function validate(inputElement, rule) {
		var errorMessage = rule.test(inputElement.value);
		var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
		// console.log(errorMessage);

		if (errorMessage) {
			errorElement.innerText = errorMessage;
			inputElement.parentElement.classList.add('invalid');
		}
		else {
			errorElement.innerText = '';
			inputElement.parentElement.classList.remove('invalid');
		}
	}

	// Lấy element của form cần validate
	var formElement = document.querySelector(options.form);
	// console.log(options.rules);
	if (formElement) {
		options.rules.forEach(function (rule) {
			// console.log(rule);
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
	}

}

// define rules
// Nguyên tắc của rules:
// 1. Khi có lỗi => trả ra message
// 2. Khi hợp lệ => không trả ra cái gì cả (undenfined)

Validator.isRequired = function (selector) {
	return {
		selector: selector,
		test: function (value) {
			return value.trim() ? undefined : 'Vui lòng nhập trường này';
		}
	}
}

Validator.isEmail = function (selector) {
	return {
		selector: selector,
		test: function (value) {
			var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			return regex.test(value) ? undefined : 'Trường này phải là email';
		}
	}
}

Validator.minLength = function (selector, min) {
	return {
		selector,
		test: function (value) {
			return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
		}
	}
}
