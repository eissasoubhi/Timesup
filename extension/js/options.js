    function save_options() {
        var ext_options = [];
        $(".options").each(function(index, el) {
            var website_options = $(this), options = {};
            options.website = website_options.find('#website').val();
            options.hours = website_options.find('#hours').val();
            options.minutes = website_options.find('#minutes').val();

            if(options.website);
                ext_options.push(options);
        });
        console.log(ext_options)
      chrome.storage.sync.set({
        ext_options: ext_options
      }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
          status.textContent = '';
        }, 750);
      });
    }

    function restore_options() {
      // Use default value color = 'red' and likesColor = true.
      chrome.storage.sync.get({
        ext_options: [],
      }, function(items) {
        var ext_options = items.ext_options,
            i, option,
            last_website = $('.options').last(),
            container = last_website.parent(),
            new_website;

        if(ext_options.length)
            last_website.hide();

        for(i in ext_options) {
            option = ext_options[i];
            website = last_website.clone(true, true).show();

            if (! option.website) continue;

            website.find('#website').val(option.website);
            website.find('#hours').val(option.hours);
            website.find('#minutes').val(option.minutes);
            container.append(website)
        }
      });
    }
    // document.addEventListener('DOMContentLoaded', restore_options);

jQuery(document).ready(function($) {

    function setDefaultOptions(website_options) {
        website_options.find('#website').val('');
        website_options.find('#hours').val('');
        website_options.find('#minutes').val('');
        return website_options;
    }

    $('body').on('click', '#add_website', function(event) {
        var last_website = $('.options').last();
        var new_website = last_website.clone(true, true);
        last_website.after(setDefaultOptions(new_website))
    });

    $('body').on('click', '#remove_website', function(event) {
        $(this).parents('.options').remove();
    });

    document.getElementById('save').addEventListener('click', save_options);

    restore_options();
});