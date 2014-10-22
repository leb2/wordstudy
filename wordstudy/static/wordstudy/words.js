$(document).ready(function() {

	// Initialize local global variables
	var questions = [];
	var canSkip = false;
	var isCorrect = false;

	// Set up initial set of words
	fetchWords(true);

	// On click, if choice is correct, display next question
	function pickChoice() {

		// Changes to border of the choice based on correctness
		isCorrect = $(this).data('id') === $('#title').data('id');
		var highlight = isCorrect ? 'correct' : 'incorrect';
		if (isCorrect) {
			updateScore(1);
		} else {
			updateScore(-0.25);
		}

		// Hides all of the other choices and animates correct choice up
		$('#choices').children().each(function() {
			if ($(this).data('id') !== $('#title').data('id')) {
				$(this).css('visibility', 'hidden');
				$(this).animate({'height': '0px', 'padding': '0px', 'margin': '0px'}, 300);
			} else {
				$(this).addClass(highlight);
			}
		});

		// Display results
		var results = $('#title').data();
		var corrects = results['correct_guesses'];
		var incorrects = results['incorrect_guesses'];
		console.log("Correct, incorrect:  " + corrects + ", " + incorrects);

		if (corrects + incorrects > 0) {
			$('#results').removeClass('hidden');
			var ratio = 0;
			if (incorrects > 0) {
				ratio = corrects / (incorrects + corrects);
				console.log("ratio  " + ratio);
			}
			$('#results').find('#top').css('width', ratio*100 + '%');

			var desciption;
			if (ratio <= 0.33) {
				description = 'hard';
			} else if (ratio <= 0.66) {
				description = 'medium';
			} else {
				description = 'easy';
			}
			$('#results').find('#difficulty').text("Difficulty: " + description);

		}
		//$('#results').html('correct_guesses: ' + results['correct_guesses'] + ' <br/> incorrect_guesses: ' + results['incorrect_guesses']);


		// Allows keypress to go to next question
		canSkip = true;

		// Listen to <Enter> and <Space> to continue
		$(document).keypress(function(e) {
			if (canSkip && (e.which === 13 || e.which === 32)) {

				// Send whether it was correct to the server
				sendMetaData(isCorrect);

				// Hides the results div
				$('#results').addClass('hidden');

				// Displays the next question
				displayQuestion();

				// Prevents <Space> and <Enter> from skipping question
				canSkip = false;
			}
		});
	}

	function sendMetaData(isCorrect) {

		var data = {
			// Retreive title from element's data
			id: $('#title').data('id'),

			// Send whether the answer is correct from parameter
			isCorrect: isCorrect,
		}

		// Send ajax request with data
		$.ajax({
			url: $('#urls #send').text(),
			type: 'POST', 
			data: data,
			dataType: 'json', 
		})
	}


	// Ajax request to fetch a group of words from server
	function fetchWords(first) {
		$.ajax({
			url: $('#urls #fetch').text(),
			type: 'GET',
			data: 'count=4',
			error: function(xhr, ajaxOptions, thrownError) {
				console.log(xhr.responseText);
			},
			success: function(response) {
				questions.push(response);	
				if (first) {
					displayQuestion(questions);
				}
			}
		});
	}

	// Displays a new question
	function displayQuestion() {
		// Fetches next batch of words
		fetchWords(false);

		// Pops question from front of questions and assigns first word to the main word
		question = questions.shift();
		questionWord = question[0];

		// Updates and binds data to title
		$('#title').text(questionWord['word']);
		$('#title').data(questionWord);


		// Clears old choices
		$('#choices').html('');

		// Randomize choice order in array
		shuffle(question);

		// Display definition of each choice and bind data to element
		for (var i=0; i<question.length; i++) {
			var word = question[i]
				$('#choices').append("<button class='choice' tabindex=0>" + word['definition'] + "</button>");
			$('#choices').find('.choice').last().data(word);
		}

		// Add click handlers to choices
		$('.choice').click(pickChoice);
	}


	// Array shuffling algorithm from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex ;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	}
})


// Updates score label by adding addition
function updateScore(addition) {
	// Retrieves score from label
	var score = parseFloat($('#score #num').text());

	// Calculates addition
	var newScore = score + addition;
	
	// Update label
	$('#score #num').text(newScore);
}



