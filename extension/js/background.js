    jQuery(document).ready(function($)
    {
        function TimesUp () {
            this.timer_interval = 5000;
            this.prefix = 'timesup';
            var self = this;
            chrome.storage.sync.get({
            ext_options: [],
            }, function(items) {
                self.included_websites = self.parseOptions(items.ext_options);
                self.ready_callback(self, self.included_websites)
            });
        }

        TimesUp.prototype.parseOptions = function (ext_options) {
            var option, included_websites = {};

            for (var i = 0; i < ext_options.length; i++) {
                option = ext_options[i];
                included_websites[ this.getLinkInfo(option.website).hostname ] = this.timeToMs(option);
            }

            return included_websites;
        }

        TimesUp.prototype.ready = function (callback) {
            return this.ready_callback = callback;
        }

        TimesUp.prototype.timeToMs = function (option) {
            // time to milliseconds
            return (option.hours || 0) * 3600000 + (option.minutes || 0) * 60000;
        }

        TimesUp.prototype.getLinkInfo = function (link) {
            var reURLInformation = new RegExp([
                '^((https?:)//)?', // protocol
                '(([^:/?#]*)(?::([0-9]+))?)', // host (hostname and port)
                '(/{0,1}[^?#]*)', // pathname
                '(\\?[^#]*|)', // search
                '(#.*|)$' // hash
            ].join(''));
            var match = link.match(reURLInformation);

            return match && {
                protocol: match[1],
                host: match[2],
                hostname: match[3],
                port: match[4],
                pathname: match[5],
                search: match[6],
                hash: match[7]
            }
        }

        TimesUp.prototype.websiteIsIncluded = function () {

            for(var website in this.included_websites)
            {
                if (this.website().origin.indexOf(website) != -1)
                    return true;
            }

            return false;
        }

        TimesUp.prototype.website = function () {
            return {
                name : window.location.hostname,
                origin : window.location.origin,
                is_blank_tab : window.location.pathname === "/_/chrome/newtab",
            };
        }

        TimesUp.prototype.timeIsOver = function () {
            var elapsed_time = this.websiteElapsedTime();
            console.log('elapsed_time', elapsed_time)
            return elapsed_time >= this.websiteMaxTime() ;
        }

        TimesUp.prototype.websiteElapsedTime = function () {
            var today = (new Date()).toDateString();
            var elapsed_time = window.localStorage[this.prefix + today];

            return elapsed_time || 0;
        }

        TimesUp.prototype.websiteMaxTime = function () {
            return this.included_websites[ this.website().name ];
        }

        TimesUp.prototype.setTime = function (time) {
            var today = (new Date()).toDateString();
            var elapsed_time = window.localStorage[this.prefix + today];

            if (! elapsed_time)
                elapsed_time = 0;

            elapsed_time = parseInt(elapsed_time) + time;
            window.localStorage[this.prefix + today] = elapsed_time;
        }

        TimesUp.prototype.startTimer = function () {
            var _this = this;
            var timer = setInterval(function () {
                    if ( _this.timeIsOver() ) {
                        clearInterval(timer);
                        return timesup.showTimesUpPopup();
                    };

                    _this.setTime(_this.timer_interval)

                }, this.timer_interval)
        }

        TimesUp.prototype.popUpHtml = function () {
            return '<div class="timesup-overly" style="'+
                            'position: fixed;'+
                            'background-color: rgba(0, 0, 0, 0.90);'+
                            'left: 0px;'+
                            'right: 0px;'+
                            'top: 0px;'+
                            'bottom: 0px;'+
                            'z-index: 199999999999999999;'+
                            'border: 10px solid #000;'+
                            'display: flex;'+
                            'align-items: center;'+
                            'justify-content: center;'+
                            'text-align: center;'+
                        '">'+
                        '<div class="timesup-msg">'+
                            '<h1 style="'+
                                'color: #8fff00;'+
                                'font-size: 40px;'+
                            '">'+
                            'TIME\'S UP for '+ this.website().name +'</h1>'+
                            '<p style="'+
                                    'color: #d8d549;'+
                                    'font-size: 22px;'+
                                '">'+
                                this.msToTime(this.websiteMaxTime()) + ' reached. </br>'+
                                'Your surfing time for this website today is up.'+
                            '</p>'+
                        '</div>'+
                    '</div>';
        }

        TimesUp.prototype.showTimesupMessag = function () {
            $('body').append(this.popUpHtml())
        }

        TimesUp.prototype.showTimesUpPopup = function () {

            if (! this.website().is_blank_tab)
            {
                this.showTimesupMessag();
            }
        }

        TimesUp.prototype.msToTime = function (s) {
            function pad(n, z) {
                z = z || 2;
                return ('00' + n).slice(-z);
            }

            var ms = s % 1000;
            s = (s - ms) / 1000;
            var secs = s % 60;
            s = (s - secs) / 60;
            var mins = s % 60;
            var hrs = (s - mins) / 60;

            return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) /*+ '.' + pad(ms, 3)*/;
        }

        window.TimesUp = TimesUp;
    });
