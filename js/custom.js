(function($, undefined){
	"use strict";

	var listItems,
		selectState = $('#selectState'),
		selectedOption,
		wrapperTrends = $('#wrapper_trends'),
		trendQuery,
		trendsList = $('#trends_list'),
		wrapperTweets = $('#wrapper_tweets'),
		tweetListHeading = $('#tweet_heading'),
		tweetList = $('#tweet_list'),
		locationsError = $('LocationsError'),
		trendsError = $('#TrendsError'),
		tweetsError = $('#TweetsError');


	
	// Get the locations from twitter
	function getTheWOEID (){		

		// load the data
		$.ajax({
			url: 'https://api.twitter.com/1/trends/available.json?callback=?',
			dataType: 'jsonp',	
			context: $('#wrapper_select'),		

			// if successful
			success: function(woeidFeed) {
				$.map(woeidFeed, function(result) {
					var countryCode = result.countryCode || "Worldwide";
					listItems += "<option value='" + result.woeid + "'>" + result.name + " - " + countryCode + "</option>";
				});

				// sort my list
				function listSort (a,b) { 
					if ( a.innerHTML < b.innerHTML ) { return -1; }
					if ( a.innerHTML > b.innerHTML ) { return 1; }
					return 0;
				}

				$(listItems).sort(listSort).appendTo(selectState);
			},

			// show error if i get a problem
			error: function (){
				selectListError();
			}

		}).done (function(){
			$(selectState).fadeIn();
			$(this).removeClass('loading');
		});
	}

	// START THE TWEET STUFF 

	// Get the Trends base on the location selected
	function getTheTrends (){
		// load the data
		$.ajax({
			url: 'http://api.twitter.com/1/trends/'+selectedOption+'.json?callback=?',
			dataType: 'jsonp',
			context: wrapperTrends,
			// if successful
			success: function(trendFeed){

				$(trendsList).empty();

				var trendData = trendFeed[0];

				$.map(trendData.trends, function(trend) {
					$(trendsList).append('<li><span><a href="'+trend.url+'" target="blank" title="' + trend.name + '">' + trend.name + ' </a></span><button class="btn btn-primary" value="'+trend.query+'" rel="'+trend.name+'">Recent tweets</button></li>');
				}); 

				// click the button to read the tweets
				$("button").bind('click',function () {
					$(wrapperTweets).hide();
					trendQuery = $(this).val();
					var tweetListName = $(this).attr("rel");
					$(tweetListHeading).html(tweetListName);
					getTheTweets();
				});
			},

			// show error if cannot load the data
			error: function() {
				trendError();
			}

		}).done (function(){
			$(this).fadeIn();
		});
	}


	// Get the latest tweets from Trend
	function getTheTweets() {
		// load the data
		$.ajax({
				url: 'http://search.twitter.com/search.json?q='+trendQuery+'&rpp=5&result_type=recent&callback=?',
				dataType: 'jsonp',
				context: wrapperTweets,
			// if successful
			success: function(tweeters) {
				$(tweetList).empty();

				$.map(tweeters.results, function(tweet) {
					$(tweetList).append ('<li><div class="user_image"><img src="' + tweet.profile_image_url + '" /></div><div class="user_name"><a href="http://www.twitter.com/'+tweet.from_user+'" target="_blank" title="Visit ' + tweet.from_user +' Twitter page">' + tweet.from_user + '</a></div><div class="user_tweet">' + tweet.text + '</div></li>');					
				});

			},
			// show error if cannot load the data
			error: function() {
				tweetError();
			}

		}).done (function(){
			$(this).fadeIn();
		});
	}

	// the error messages
	function selectListError (){
		$(locationsError).fadeIn();
	}

	function trendError (){
		$(trendsError).fadeIn();
	}

	function tweetError (){
		$(tweetsError).fadeIn();
	}

	function resetAll(){
		$(wrapperTrends).fadeOut();
		$(wrapperTweets).fadeOut();
		$(locationsError).fadeOut();
		$(trendsError).fadeOut();
		$(tweetsError).fadeOut();
	}


	$(selectState).change(function(){
		resetAll();
		selectedOption = $("#selectState").val();
		getTheTrends();
	});


	getTheWOEID();


})(jQuery);