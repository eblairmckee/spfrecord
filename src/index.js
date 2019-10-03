import './scss/style.scss';
import 'jquery';
import 'bootstrap';
import $ from 'jquery';
import jQuery from 'jquery';
window.$ = jQuery;
import copy from 'copy-to-clipboard';
import logo from './images/assembly-line.png';

//font awesome
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

/*jshint esversion: 6 */
$(document).ready(() => {
	//font awesome
	library.add(fas, far, fab);
	dom.i2svg();

	//reusable objects
	const answer = $('#answer');
	const domain = $('#domain');
	const form = $('#form__spf-wizard');
	const inputs = 'input[name=MXServers], input[name=IPAddress], input[name=hostnames], input[name=strict]';
	const copyButton = $('.input__answer__copy');

	// copy answer
	$(copyButton).on('click', () => {
		answer.select();
		copy(answer.val());
		// document.execCommand('copy');
		console.log(answer.val());
	});

	//Auto insert domain name
	let domainNameText = $('.domainName');
	let domainNamePlaceHolder = 'your domain';
	let domainName = '';

	$(domain).keyup(x => {
		if ($(domain).val() === '') {
			$(domainNameText).text(domainNamePlaceHolder);
		} else {
			domainName = $(domain).val();
			$(domainNameText).text(domainName);
		}
	});
	$(domainNameText).text(domainNamePlaceHolder);

	//auto insert domain name in #answer
	// $(domain).keyup(x => {
	//     if ($(domain).val == "") {
	//         yourDomain = "example.com. IN TXT";
	//     } else {
	//         yourDomain = $(domain).val() + ". IN TXT";
	//         //now recordInfo only shows if domain has a value
	//     }
	//     printAnswer();
	// });

	//Event Handlers
	$(inputs).on('click', () => {
		printAnswer();
	});

	const relayIPAddress = $('#relayIPAddress');
	$(relayIPAddress).on('keyup', () => {
		printAnswer();
	});

	const relayHostnames = $('#relayHostnames');
	$(relayHostnames).on('keyup', () => {
		printAnswer();
	});

	$('#relayDomains').on('keyup', () => {
		printAnswer();
	});

	//Print Answer to DOM

	const printAnswer = () => {
		//no longer reruns or duplicates value in answer box
		let MXServers = $('input[name=MXServers]:checked').val();
		let IPAddress = $('input[name=IPAddress]:checked').val();
		// let Hostnames = $("input[name=hostnames]:checked").val();
		let strict = $('input[name=strict]:checked').val();

		let inputAnswers = [
			// yourDomain,
			// " ",
			'v=spf1 ',
			MXServers,
			IPAddress,
			// Hostnames,
			strict
		];

		//relay IP address
		let relayArray = $(relayIPAddress)
			.val()
			.split(' ');

		const hasDot = address => {
			return address.includes('.');
		};
		const hasColon = address => {
			return address.includes(':');
		};

		let relayArrayIPv6 = relayArray
			.filter(hasColon)
			.map(function(el) {
				return ' ip6:' + el;
			})
			.join(' ');

		let relayArrayIPv4 = relayArray
			.filter(hasDot)
			.map(function(el) {
				return ' ip4:' + el;
			})
			.join(' ');

		if ($(relayIPAddress).val() == 0) {
			//nothing
		} else {
			inputAnswers.splice(3, 0, relayArrayIPv4, relayArrayIPv6);
		}

		//relay hostnames
		let relayHostnamesArray = $(relayHostnames)
			.val()
			.split(' ');
		let relayHostnamesArrayAppended = relayHostnamesArray
			.map(function(el) {
				return ' a:' + el; //need regex that toggles ip4 or ip6 if colons are used
			})
			.join(' ');

		if ($(relayHostnames).val() == 0) {
			//nothing
		} else {
			inputAnswers.splice(3, 0, relayHostnamesArrayAppended);
		}

		//relay domains
		let relayDomainsArray = $('#relayDomains')
			.val()
			.split(' ');
		let relayDomainsArrayAppended = relayDomainsArray
			.map(function(el) {
				return ' include:' + el; //need regex that toggles ip4 or ip6 if colons are used
			})
			.join(' ');

		if ($('#relayDomains').val() == 0) {
			//nothing
		} else {
			inputAnswers.splice(3, 0, relayDomainsArrayAppended);
		}

		$(answer).val(inputAnswers.join(''));
	};

	//clear answer
	const clearAnswer = document.getElementsByClassName('input__answer__clear');

	const clearFunction = () => {
		$(answer).val('');
		$(domain).val('');
		$(domainNameText).text(domainNamePlaceHolder);

		//clear all inputs
		let allRadioInputs = document.getElementsByTagName('input');
		$(allRadioInputs).each(function(i) {
			this.checked = false;
		});

		let allTextInputs = document.getElementsByTagName('input');
		$(allTextInputs).each(function(i) {
			this.value = '';
		});
	};

	$(clearAnswer).on('click', clearFunction);
});
