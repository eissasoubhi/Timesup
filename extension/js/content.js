jQuery(document).ready(function($) {
    timesup = new TimesUp();

    timesup.ready(function(timesup, max_times) {

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
