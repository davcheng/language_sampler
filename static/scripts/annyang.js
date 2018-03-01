"use strict";

// first we make sure annyang started succesfully
if (annyang) {
  annyang.start();
  var recognition = annyang.getSpeechRecognizer();
  var final_transcript = '';
  recognition.interimResults = true;
  recognition.onresult = function(event) {
    var interim_transcript = '';
    final_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
            console.log("final_transcript="+final_transcript);
            annyang.trigger(final_transcript); //If the sentence is "final" for the Web Speech API, we can try to trigger the sentence
        } else {
            interim_transcript += event.results[i][0].transcript;
            console.log("interim_transcript="+interim_transcript);
        }
    }

    document.getElementById('speechtext').innerHTML += "<p class='voice_instructions'>" + final_transcript + "</p>";
    console.log('interim='+interim_transcript+'|final='+final_transcript);
  };


  // Commands

  var showFlickr = function(tag) {
    $('#flickrGallery').show();
    $('#flickrLoader p').text('Searching for '+tag).fadeIn('fast');
    var url = '//api.flickr.com/services/rest/?method=flickr.photos.search&api_key=a828a6571bb4f0ff8890f7a386d61975&sort=interestingness-desc&per_page=9&format=json&callback=jsonFlickrApi&tags='+tag;
    $.ajax({
      type: 'GET',
      url: url,
      async: false,
      jsonpCallback: 'jsonFlickrApi',
      contentType: "application/json",
      dataType: 'jsonp'
    });
    scrollTo("#section_image_search");
  };

  var jsonFlickrApi = function(results) {
    $('#flickrLoader p').fadeOut('slow');
    var photos = results.photos.photo;
    $.each(photos, function(index, photo) {
      $(document.createElement("img"))
        .attr({ src: '//farm'+photo.farm+'.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'_s.jpg' })
        .addClass("flickrGallery")
        .appendTo(flickrGallery);
    });
  };

  // define our commands.
  // * The key is the phrase you want your users to say.
  // * The value is the action to do.
  //   You can pass a function, a function name (as a string), or write your function as part of the commands object.
  var commands = {
    'show me *search':      showFlickr,
  };

  // OPTIONAL: activate debug mode for detailed logging in the console
  annyang.debug();

  // Add voice commands to respond to
  annyang.addCommands(commands);

  // OPTIONAL: Set a language for speech recognition (defaults to English)
  // For a full list of language codes, see the documentation:
  // https://github.com/TalAter/annyang/blob/master/docs/FAQ.md#what-languages-are-supported
  annyang.setLanguage('en');

} else {
  $(document).ready(function() {
    $('#unsupported').fadeIn('fast');
  });
}

// var scrollTo = function(identifier, speed) {
//   $('html, body').animate({
//       scrollTop: $(identifier).offset().top
//   }, speed || 1000);
// }
