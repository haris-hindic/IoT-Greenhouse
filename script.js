const firebaseConfig = {
	apiKey: 'AIzaSyAclMt1uLepHME3XP6tSVnSVMNRpVEq36E',
	authDomain: 'greenhouse-iot-b273a.firebaseapp.com',
	databaseURL:
		'https://greenhouse-iot-b273a-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'greenhouse-iot-b273a',
	storageBucket: 'greenhouse-iot-b273a.appspot.com',
	messagingSenderId: '645433721971',
	appId: '1:645433721971:web:701cc335eac5c52b41d606',
	measurementId: 'G-BJB1RJTCCH',
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

//firebase data
let temp = firebase.database().ref('Data').child('temperature');
let hum = firebase.database().ref('Data').child('humidity');
let rain = firebase.database().ref('Data').child('rain');
let waterTank1 = firebase.database().ref('Data').child('waterTank1');

let openRoof = firebase.database().ref('Controls').child('openRoof');
let lighting = firebase.database().ref('Controls').child('lighting');
let fillingTank1 = false;

//dom elements

temp.on('value', data => {
	document.querySelector('#temperature').innerHTML = data.val() + '°C';
	document.querySelector('#temperatureProgress').style.width = data.val() + '%';
});

hum.on('value', data => {
	document.querySelector('#humidity').innerHTML = data.val() + '%';
	document.querySelector('#humidityProgress').style.width = data.val() + '%';
});

rain.on('value', data => {
	if (data.val() === true) {
		document.querySelector('#rain').style.display = 'inline';
		document.querySelector('#noRain').style.display = 'none';
	} else {
		document.querySelector('#rain').style.display = 'none';
		document.querySelector('#noRain').style.display = 'inline';
	}
});

lighting.on('value', data => {
	if (data.val() === true) {
		document.querySelector('#lighting').setAttribute('checked', '');
		document.querySelector('#lightsOn').style.display = 'inline';
		document.querySelector('#lightsOff').style.display = 'none';
	} else {
		document.querySelector('#lighting').removeAttribute('checked');
		document.querySelector('#lightsOn').style.display = 'none';
		document.querySelector('#lightsOff').style.display = 'inline';
	}
});

openRoof.on('value', data => {
	if (data.val() === true) {
		document.querySelector('#openRoof').setAttribute('checked', '');
		document.querySelector('#opened').style.display = 'block';
		document.querySelector('#closed').style.display = 'none';
		document.querySelector('#headingOpened').style.display = 'block';
		document.querySelector('#headingClosed').style.display = 'none';
	} else {
		document.querySelector('#openRoof').removeAttribute('checked');
		document.querySelector('#opened').style.display = 'none';
		document.querySelector('#closed').style.display = 'block';
		document.querySelector('#headingOpened').style.display = 'none';
		document.querySelector('#headingClosed').style.display = 'block';
	}
});

let waterTank1Value;
waterTank1.on('value', data => {
	waterTank1Value = data.val();
	let txt;
	if (waterTank1Value === 100) {
		txt = 'Full';
		document.querySelector('#fill1').disabled = true;
	}
	if (waterTank1Value === 80) {
		txt = 'Full';
		document.querySelector('#fill1').disabled = false;
	}
	if (waterTank1Value === 60) {
		txt = 'Half full';
		document.querySelector('#fill1').disabled = false;
	}
	if (waterTank1Value === 40) {
		txt = '1/3 full';
		document.querySelector('#fill1').disabled = false;
	}
	if (waterTank1Value === 20) {
		txt = '1/3 full';
		document.querySelector('#fill1').disabled = false;
	}
	if (waterTank1Value === 0) {
		txt = 'Empty';
		document.querySelector('#fill1').disabled = false;
	}
	document.querySelector('#water1Title').innerHTML = `Water tank - ${txt}`;
	document.querySelector('#water1').style.top = 100 - data.val() + '%';
});

//events

document.querySelector('#lighting').addEventListener('change', e => {
	lighting.set(e.target.checked);
});

document.querySelector('#openRoof').addEventListener('change', e => {
	openRoof.set(e.target.checked);
});

window.addEventListener('DOMContentLoaded', event => {
	setInterval(() => {
		let tempRand = parseInt(Math.random() * 6) + 16;
		let humRand = parseInt(Math.random() * 5) + 70;
		let rainRand = parseInt(Math.random() * 2);

		temp.set(tempRand);
		hum.set(humRand);
		rain.set(rainRand === 1 ? true : false);
		if (waterTank1Value > 0 && !fillingTank1) {
			waterTank1.set(waterTank1Value - 20);
		}
	}, 10000);
});

document.querySelector('#fill1').addEventListener('click', () => {
	fillingTank1 = true;

	document.querySelector('#water1Title').innerHTML = `Water tank - <img
	style="width: 50px; height: 50px"
	src="https://i.imgur.com/yJQKtNT.gif"
/> filling`;

	setTimeout(() => {
		waterTank1.set(100);
		fillingTank1 = false;
	}, 2500);
});
