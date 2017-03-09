jQuery(document).ready(function($) {
    timesup = new TimesUp();

    timesup.ready(function(timesup, max_times) {
        // console.log(timesup.websiteIsIncluded())
        if ( timesup.websiteIsIncluded() ) {
            if (timesup.timeIsOver()) {
                timesup.showTimesUpPopup();
            }
            else
            {
                timesup.startTimer()
            }
        };
    });

});
